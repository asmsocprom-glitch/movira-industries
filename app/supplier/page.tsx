"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";

interface Product {
  productId: string;
  title: string;
  quantity: number;
  variant: string;
  specification: string;
  image: string;
  price?: number;
  totalPrice?: number;
}

interface SupplierRequest {
  id: string;
  clientId: string;
  products: Product[];
}

interface Client {
  name: string;
  address: string;
}

interface Quotation {
  id: string;
  supplierRequestId: string;
  clientId: string;
  supplierEmail: string;
  products: Product[];
  status: "under_review" | "accepted" | "rejected";
}

export default function SupplierDashboard() {
  const { user } = useUser();
  const supplierEmail = user?.primaryEmailAddress?.emailAddress || "";

  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supplierEmail) return;

    const loadData = async () => {
      setLoading(true);

      const quotationSnap = await getDocs(
        query(
          collection(db, "quotations"),
          where("supplierEmail", "==", supplierEmail),
          orderBy("createdAt", "desc")
        )
      );

      const allQuotations: Quotation[] = quotationSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Quotation, "id">),
      }));

      const visibleQuotations = allQuotations.filter(
        (q) => q.status !== "rejected"
      );

      setQuotations(visibleQuotations);

      const quotedRequestIds = new Set(
        visibleQuotations.map((q) => q.supplierRequestId)
      );

      const requestSnap = await getDocs(collection(db, "supplierRequests"));
      const reqList: SupplierRequest[] = [];
      const clientCache: Record<string, Client> = {};

      for (const d of requestSnap.docs) {
        const data = d.data();
        if (quotedRequestIds.has(d.id)) continue;

        reqList.push({
          id: d.id,
          clientId: data.clientId,
          products: data.products,
        });

        if (!clientCache[data.clientId]) {
          const cSnap = await getDoc(doc(db, "clients", data.clientId));
          if (cSnap.exists()) clientCache[data.clientId] = cSnap.data() as Client;
        }
      }

      for (const q of visibleQuotations) {
        if (!clientCache[q.clientId]) {
          const cSnap = await getDoc(doc(db, "clients", q.clientId));
          if (cSnap.exists()) clientCache[q.clientId] = cSnap.data() as Client;
        }
      }

      setRequests(reqList);
      setClients(clientCache);
      setLoading(false);
    };

    loadData();
  }, [supplierEmail]);

  const submitQuotation = async (req: SupplierRequest) => {
    const selectedProducts = req.products
      .filter((p) => prices[`${req.id}_${p.productId}`])
      .map((p) => {
        const price = Number(prices[`${req.id}_${p.productId}`]);
        return {
          ...p,
          price,
          totalPrice: price * p.quantity,
        };
      });

    if (!selectedProducts.length) {
      alert("Please enter at least one price before submitting.");
      return;
    }

    await addDoc(collection(db, "quotations"), {
      supplierRequestId: req.id,
      clientId: req.clientId,
      supplierEmail,
      products: selectedProducts,
      status: "under_review",
      createdAt: serverTimestamp(),
    });

    alert("Quotation submitted successfully");
    window.location.reload();
  };

  const rejectRequest = async (req: SupplierRequest) => {
    if (!confirm("Reject this request?")) return;

    await addDoc(collection(db, "quotations"), {
      supplierRequestId: req.id,
      clientId: req.clientId,
      supplierEmail,
      products: req.products,
      status: "rejected",
      createdAt: serverTimestamp(),
    });

    alert("Request rejected");
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  if (loading) return <p className="p-6 min-h-screen">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-semibold">Supplier Dashboard</h1>
          <SignOutButton>
            <button className="bg-black text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        {requests.length === 0 && <p className="text-gray-500">No pending requests</p>}

        {requests.map((req) => {
          const client = clients[req.clientId];
          return (
            <div key={req.id} className="bg-white p-6 rounded mb-6 shadow">
              <p className="font-medium mb-3">
                {client?.name} — {client?.address}
              </p>

              {req.products.map((p) => {
                const price = Number(prices[`${req.id}_${p.productId}`] || 0);
                const total = price * p.quantity;

                return (
                  <div key={p.productId} className="flex gap-4 mb-3 items-center">
                    <div className="relative w-16 h-16">
                      <Image src={p.image} alt={p.title} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <p>{p.title}</p>
                      <p className="text-sm">
                        {p.variant} | Qty: {p.quantity}
                      </p>
                      {price > 0 && (
                        <p className="text-sm font-medium">
                          Total: ₹ {total}
                        </p>
                      )}
                    </div>
                    <input
                      type="number"
                      placeholder="Price per piece"
                      className="border px-3 py-2 w-36 rounded"
                      value={prices[`${req.id}_${p.productId}`] || ""}
                      onChange={(e) =>
                        setPrices((prev) => ({
                          ...prev,
                          [`${req.id}_${p.productId}`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                );
              })}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => submitQuotation(req)}
                  className="bg-green-600 text-white px-5 py-2 rounded"
                >
                  Submit Quotation
                </button>
                <button
                  onClick={() => rejectRequest(req)}
                  className="bg-red-600 text-white px-5 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}

        <h2 className="text-xl font-semibold mt-12 mb-4">My Quotations</h2>
        {quotations.length === 0 && <p className="text-gray-500">No quotations</p>}

        {quotations.map((q) => {
          const client = clients[q.clientId];
          return (
            <div key={q.id} className="bg-white p-6 rounded mb-6 border">
              <p className="font-medium mb-1">
                {client?.name} — {client?.address}
              </p>

              {q.products.map((p) => (
                <div key={p.productId} className="flex justify-between text-sm mb-1">
                  <span>
                    {p.title} × {p.quantity}
                  </span>
                  <span>
                    ₹ {p.price} | Total ₹ {p.totalPrice}
                  </span>
                  <span>
                    {q.status}
                  </span>
                </div>
                
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
