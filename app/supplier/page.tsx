"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";

interface Product {
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  image: string;
  quantity: number;
}

interface SupplierRequest {
  id: string;
  product: Product;
}

interface Quotation {
  id: string;
  supplierRequestId: string;
  supplierEmail: string;
  price: number;
  status: string; // under_review | accepted | lost
  product: Product;
}

interface SupplierAction {
  supplierRequestId: string;
  supplierEmail: string;
  action: string; // "rejected"
}

export default function SupplierDashboard() {
  const { user } = useUser();
  const supplierEmail = user?.primaryEmailAddress?.emailAddress || "";

  const [newRequests, setNewRequests] = useState<SupplierRequest[]>([]);
  const [myQuotations, setMyQuotations] = useState<Quotation[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!supplierEmail) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // All supplier requests
        const reqSnap = await getDocs(
          query(collection(db, "supplierRequests"), orderBy("createdAt", "desc"))
        );
        const allRequests: SupplierRequest[] = reqSnap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any),
        }));

        // Supplier's quotations
        const quoteSnap = await getDocs(
          query(
            collection(db, "quotations"),
            where("supplierEmail", "==", supplierEmail)
          )
        );
        const quotes: Quotation[] = quoteSnap.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            supplierRequestId: data.supplierRequestId,
            supplierEmail: data.supplierEmail,
            price: data.price,
            status: data.status,
            product: data.product,
          };
        });

        // Supplier rejected actions
        const actionSnap = await getDocs(
          query(
            collection(db, "supplierActions"),
            where("supplierEmail", "==", supplierEmail),
            where("action", "==", "rejected")
          )
        );
        const rejectedIds = new Set<string>();
        actionSnap.docs.forEach(doc => {
          const data = doc.data() as SupplierAction;
          rejectedIds.add(data.supplierRequestId);
        });

        // Filter new requests (not quoted and not rejected)
        const quotedIds = new Set(quotes.map(q => q.supplierRequestId));
        const filteredRequests = allRequests.filter(
          r => !quotedIds.has(r.id) && !rejectedIds.has(r.id)
        );

        setNewRequests(filteredRequests);
        setMyQuotations(quotes);
      } catch (err) {
        console.error("Error fetching supplier data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supplierEmail]);

  const acceptRequest = async (req: SupplierRequest) => {
    const priceInput = prices[req.id];
    if (!priceInput) return alert("Please enter a price.");

    if (!confirm("Are you sure you want to submit this quotation?")) return;

    setProcessing(prev => ({ ...prev, [req.id]: true }));

    try {
      const price = Number(priceInput);
      await addDoc(collection(db, "quotations"), {
        supplierRequestId: req.id,
        supplierEmail,
        product: req.product,
        price,
        status: "under_review",
        createdAt: serverTimestamp(),
      });

      setNewRequests(prev => prev.filter(r => r.id !== req.id));
      setMyQuotations(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          supplierRequestId: req.id,
          supplierEmail,
          price,
          status: "under_review",
          product: req.product,
        },
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to submit quotation.");
    } finally {
      setProcessing(prev => ({ ...prev, [req.id]: false }));
    }
  };

  const rejectRequest = async (req: SupplierRequest) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    setProcessing(prev => ({ ...prev, [req.id]: true }));

    try {
      await addDoc(collection(db, "supplierActions"), {
        supplierRequestId: req.id,
        supplierEmail,
        action: "rejected",
        createdAt: serverTimestamp(),
      });

      setNewRequests(prev => prev.filter(r => r.id !== req.id));
    } catch {
      alert("Failed to reject request.");
    } finally {
      setProcessing(prev => ({ ...prev, [req.id]: false }));
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Supplier Dashboard</h1>
          <SignOutButton>
            <button className="bg-black text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <Section title="New Requests">
          {newRequests.map(req => (
            <Card key={req.id}>
              <ProductDisplay product={req.product} />
              <div className="flex gap-3 mt-3">
                <input
                  type="number"
                  placeholder="Enter price"
                  value={prices[req.id] || ""}
                  onChange={e => setPrices({ ...prices, [req.id]: e.target.value })}
                  className="border px-3 py-2 rounded w-40"
                />
                <button
                  disabled={processing[req.id]}
                  onClick={() => acceptRequest(req)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>
                <button
                  disabled={processing[req.id]}
                  onClick={() => rejectRequest(req)}
                  className="border px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </Card>
          ))}
        </Section>

        <Section title="My Quotations">
          {myQuotations.map(q => (
            <Card key={q.id}>
              <ProductDisplay product={q.product} />
              <p className="text-sm mt-2">
                {q.status === "under_review"
                  ? "Waiting for admin decision"
                  : q.status === "accepted"
                  ? "Accepted by Admin"
                  : "Not Selected"}
              </p>
              <p className="text-sm font-semibold mt-1">Price: ₹{q.price}</p>
            </Card>
          ))}
        </Section>
      </div>
    </div>
  );
}

const Section = ({ title, children }: any) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children.length === 0 ? (
      <p className="text-gray-500">No items</p>
    ) : (
      <div className="space-y-4">{children}</div>
    )}
  </div>
);

const Card = ({ children }: any) => (
  <div className="bg-white p-5 rounded-lg shadow">{children}</div>
);

const ProductDisplay = ({ product }: { product: Product }) => (
  <div className="flex gap-4">
    <div className="relative w-20 h-20">
      <Image
        src={product.image}
        alt={product.title}
        fill
        className="object-cover rounded"
      />
    </div>
    <div>
      <h3 className="font-medium">{product.title}</h3>
      <p className="text-sm">{product.variant}</p>
      <p className="text-sm">Qty: {product.quantity}</p>
    </div>
  </div>
);
