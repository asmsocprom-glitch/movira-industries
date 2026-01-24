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

      setQuotations(allQuotations.filter((q) => q.status !== "rejected"));

      const handledRequestIds = new Set(
        allQuotations.map((q) => q.supplierRequestId)
      );

      const requestSnap = await getDocs(collection(db, "supplierRequests"));
      const reqList: SupplierRequest[] = [];
      const clientCache: Record<string, Client> = {};

      for (const d of requestSnap.docs) {
        const data = d.data();
        if (handledRequestIds.has(d.id)) continue;

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

      for (const q of allQuotations) {
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
        return { ...p, price, totalPrice: price * p.quantity };
      });

    if (!selectedProducts.length) {
      alert("Please enter at least one price");
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

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
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

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  if (loading) return <p className="p-8 min-h-screen bg-[#f7f6f2] font-Manrope">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-Manrope  py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          </div>
          <SignOutButton>
            <button className="px-4 py-2 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </SignOutButton>
        </div>

        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>

        {requests.length === 0 && (
          <p className="text-gray-500 mb-10">No pending requests</p>
        )}

        <div className="space-y-8">
          {requests.map((req) => {
            const client = clients[req.clientId];
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl shadow-sm border p-6"
              >
                <div className="mb-5">
                  <p className="font-semibold">
                    {client?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {client?.address}
                  </p>
                </div>

                <div className="space-y-4">
                  {req.products.map((p) => {
                    const price = Number(prices[`${req.id}_${p.productId}`] || 0);
                    const total = price * p.quantity;

                    return (
                      <div
                        key={p.productId}
                        className="flex items-center gap-4 p-4 border rounded-xl"
                      >
                        <div className="relative w-16 h-16 shrink-0">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">{p.title}</p>
                          <p className="text-sm text-gray-500">
                            {p.variant} • Qty {p.quantity}
                          </p>
                          {price > 0 && (
                            <p className="text-sm font-semibold mt-1">
                              Total ₹ {total}
                            </p>
                          )}
                        </div>

                        <input
                          type="number"
                          placeholder="Price Per piece"
                          className="w-32 border rounded-lg px-3 py-2 text-sm"
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
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => submitQuotation(req)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg"
                  >
                    Submit Quotation
                  </button>
                  <button
                    onClick={() => rejectRequest(req)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <h2 className="text-xl font-semibold mt-14 mb-4">My Quotations</h2>

        {quotations.length === 0 && (
          <p className="text-gray-500">No quotations</p>
        )}

        <div className="space-y-6">
          {quotations.map((q) => {
            const client = clients[q.clientId];
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border p-6"
              >
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-semibold">{client?.name}</p>
                    <p className="text-sm text-gray-500">
                      {client?.address}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-lg bg-yellow-100 text-yellow-700 capitalize">
                    {q.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  {q.products.map((p) => (
                    <div
                      key={p.productId}
                      className="flex justify-between border-b pb-1"
                    >
                      <span>
                        {p.title} × {p.quantity}
                      </span>
                      <span>
                        ₹ {p.price} → ₹ {p.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
