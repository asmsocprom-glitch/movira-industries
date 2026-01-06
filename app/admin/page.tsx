"use client";

import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";

interface Product {
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  image: string;
  quantity: string;
}

interface Quotation {
  id: string;
  supplierEmail: string;
  supplierRequestId: string;
  price: number;
  status: string;
}

interface FinalOrder {
  supplierEmail: string;
  supplierPrice: number;
  margin: number;
  finalPrice: number;
}

interface SupplierRequest {
  id: string;
  product: Product;
  status: string;
  finalOrder?: FinalOrder;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [quotationsMap, setQuotationsMap] = useState<Record<string, Quotation[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Supplier requests
        const reqSnap = await getDocs(collection(db, "supplierRequests"));
        const allRequests = reqSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

        // Quotations
        const quoteSnap = await getDocs(collection(db, "quotations"));
        const map: Record<string, Quotation[]> = {};
        quoteSnap.docs.forEach(doc => {
          const q = { id: doc.id, ...(doc.data() as any) };
          if (!map[q.supplierRequestId]) map[q.supplierRequestId] = [];
          map[q.supplierRequestId].push(q);
        });
        setQuotationsMap(map);

        // Final Orders
        const finalSnap = await getDocs(collection(db, "finalOrders"));
        const finalMap: Record<string, FinalOrder> = {};
        finalSnap.docs.forEach(doc => {
          const data = doc.data() as any;
          finalMap[data.supplierRequestId] = {
            supplierEmail: data.supplierEmail,
            supplierPrice: data.supplierPrice,
            margin: data.margin,
            finalPrice: data.finalPrice,
          };
        });

        // Merge final orders into requests
        const merged = allRequests.map(r => ({
          ...r,
          finalOrder: finalMap[r.id],
          status: finalMap[r.id] ? "finalized" : r.status,
        }));

        setRequests(merged);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const acceptQuotation = async (req: SupplierRequest, q: Quotation) => {
    const marginInput = prompt(`Enter margin for ${q.supplierEmail}:`);
    if (!marginInput) return;
    const margin = Number(marginInput);
    if (isNaN(margin)) { alert("Invalid margin"); return; }
    if (!confirm(`Accept ${q.supplierEmail} with margin ${margin}?`)) return;

    try {
      const batch = writeBatch(db);
      const finalPrice = q.price + margin;

      // Save final order
      const finalRef = doc(collection(db, "finalOrders"));
      batch.set(finalRef, {
        supplierRequestId: req.id,
        supplierEmail: q.supplierEmail,
        supplierPrice: q.price,
        margin,
        finalPrice,
        product: req.product,
        createdAt: serverTimestamp(),
      });

      // Update quotations
      batch.update(doc(db, "quotations", q.id), { status: "accepted", margin, finalPrice });
      quotationsMap[req.id]?.forEach(other => {
        if (other.id !== q.id) batch.update(doc(db, "quotations", other.id), { status: "lost" });
      });

      // Update request
      batch.update(doc(db, "supplierRequests", req.id), { status: "finalized" });

      await batch.commit();
      alert("Accepted successfully!");

      // Update UI immediately
      setRequests(prev => prev.map(r => 
        r.id === req.id ? { ...r, status: "finalized", finalOrder: { supplierEmail: q.supplierEmail, supplierPrice: q.price, margin, finalPrice } } : r
      ));
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push("/admin/requests")}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Go to Client Requests
          </button>
          <SignOutButton>
            <button className="bg-red-600 text-white px-4 py-2 rounded">Sign Out</button>
          </SignOutButton>
        </div>
      </div>

      {requests.map(req => (
        <div key={req.id} className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-semibold text-lg">{req.product.title}</h2>
          <p className="text-sm text-gray-600">{req.product.variant} | {req.product.specification}</p>

          <div className="flex gap-4 mt-3 mb-3">
            <div className="relative w-20 h-20">
              <Image src={req.product.image} alt={req.product.title} fill className="object-cover rounded" />
            </div>
            <div>
              <p><b>Quantity:</b> {req.product.quantity}</p>
            </div>
          </div>

          {!req.finalOrder && (
            <>
              <h4 className="font-semibold mb-2">Supplier Quotes:</h4>
              {quotationsMap[req.id]?.map(q => (
                <div key={q.id} className="flex justify-between items-center border p-2 rounded mb-2">
                  <span>{q.supplierEmail} — ₹{q.price}</span>
                  {q.status === "under_review" && (
                    <button onClick={() => acceptQuotation(req, q)} className="bg-green-600 text-white px-3 py-1 rounded">
                      Accept
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          {req.finalOrder && (
            <div className="mt-4 p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <h4 className="font-semibold mb-2 text-green-700">Final Order</h4>
              <p><b>Supplier:</b> {req.finalOrder.supplierEmail}</p>
              <p><b>Supplier Price:</b> ₹{req.finalOrder.supplierPrice}</p>
              <p><b>Margin:</b> ₹{req.finalOrder.margin}</p>
              <p className="text-lg font-semibold"><b>Final Price:</b> ₹{req.finalOrder.finalPrice}</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send Request to Client
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
