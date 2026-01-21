"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Product {
  productId: string;
  title: string;
  variant?: string;
  specification?: string;
  quantity: number;
  price?: number;
}

interface SupplierRequest {
  id: string;
  clientId: string;
  products: Product[];
  status: "pending" | "accepted";
}

interface Quotation {
  id: string;
  supplierRequestId: string;
  clientId: string;
  supplierEmail: string;
  products: Product[];
  status: "under_review" | "accepted" | "lost";
}

interface Client {
  name: string;
  address?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [quotations, setQuotations] = useState<Record<string, Quotation[]>>({});
  const [modalRequest, setModalRequest] = useState<SupplierRequest | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marginMap, setMarginMap] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const clientReqSnap = await getDocs(collection(db, "clientRequests"));
      setPendingCount(
        clientReqSnap.docs.filter(d => d.data().status === "pending").length
      );

      const srSnap = await getDocs(
        query(collection(db, "supplierRequests"), where("status", "!=", "accepted"))
      );

      const srList: SupplierRequest[] = [];
      const clientCache: Record<string, Client> = {};

      for (const d of srSnap.docs) {
        const data = d.data();

        srList.push({
          id: d.id,
          clientId: data.clientId,
          products: data.products,
          status: data.status,
        });

        if (!clientCache[data.clientId]) {
          const c = await getDoc(doc(db, "clients", data.clientId));
          if (c.exists()) clientCache[data.clientId] = c.data() as Client;
        }
      }

      const qSnap = await getDocs(collection(db, "quotations"));
      const qMap: Record<string, Quotation[]> = {};

      qSnap.docs.forEach(d => {
        const q = { id: d.id, ...(d.data() as Omit<Quotation, "id">) };
        if (q.status !== "under_review") return;
        if (!qMap[q.supplierRequestId]) qMap[q.supplierRequestId] = [];
        qMap[q.supplierRequestId].push(q);
      });

      setRequests(srList);
      setClients(clientCache);
      setQuotations(qMap);
      setLoading(false);
    };

    load();
  }, []);

  const acceptQuotation = async (q: Quotation) => {
    const margins = marginMap[q.id];
    if (!margins) return alert("Enter margin for each product");

    const productsWithMargin = q.products.map(p => {
      const margin = Number(margins[p.productId] || 0);
      const baseTotal = (p.price || 0) * p.quantity;
      return {
        ...p,
        baseTotal,
        margin,
        finalTotal: baseTotal + margin,
      };
    });

    await addDoc(collection(db, "finalOrders"), {
      supplierRequestId: q.supplierRequestId,
      clientId: q.clientId,
      supplierEmail: q.supplierEmail,
      products: productsWithMargin,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "quotations", q.id), { status: "accepted" });

    for (const other of quotations[q.supplierRequestId] || []) {
      if (other.id !== q.id) {
        await updateDoc(doc(db, "quotations", other.id), { status: "lost" });
      }
    }

    await updateDoc(doc(db, "supplierRequests", q.supplierRequestId), {
      status: "accepted",
    });

    setRequests(prev => prev.filter(r => r.id !== q.supplierRequestId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f2] font-Manrope ">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-Manrope px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/requests")}
              className="px-4 py-2 bg-white border rounded-lg text-sm"
            >
              Requests <span className="text-blue-600">({pendingCount})</span>
            </button>

            <button
              onClick={() => router.push("/admin/final-orders")}
              className="px-4 py-2 bg-white border rounded-lg text-sm"
            >
              Final Orders
            </button>

            <SignOutButton>
              <button className="px-4 py-2 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
            </SignOutButton>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => {
            const client = clients[req.clientId];
            const qs = quotations[req.id] || [];

            return (
              <div key={req.id} className="bg-white rounded-2xl border p-5 shadow-sm">
                <div className="mb-3">
                  <h3 className="font-semibold">{client?.name}</h3>
                  <p className="text-sm text-gray-500">{client?.address}</p>
                </div>

                <button
                  onClick={() => setModalRequest(req)}
                  className="text-sm text-blue-600 underline"
                >
                  View request details
                </button>

                <div className="mt-4 space-y-4">
                  {qs.map(q => (
                    <div key={q.id} className="bg-gray-50 rounded-xl p-4 border">
                      <p className="font-medium text-sm mb-3">
                        {q.supplierEmail}
                      </p>

                      <div className="space-y-3">
                        {q.products.map(p => (
                          <div
                            key={p.productId}
                            className="flex justify-between items-center gap-3"
                          >
                            <div className="text-sm">
                              <p className="font-medium">{p.title}</p>
                              <p className="text-gray-500">
                                ₹{p.price} × {p.quantity}
                              </p>
                            </div>

                            <input
                              type="number"
                              placeholder="Margin"
                              className="w-24 border rounded px-2 py-1 text-sm"
                              value={marginMap[q.id]?.[p.productId] || ""}
                              onChange={e =>
                                setMarginMap(prev => ({
                                  ...prev,
                                  [q.id]: {
                                    ...(prev[q.id] || {}),
                                    [p.productId]: e.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => acceptQuotation(q)}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-sm"
                      >
                        Accept Quotation
                      </button>
                    </div>
                  ))}

                  {qs.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No quotations yet
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {modalRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setModalRequest(null)}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {clients[modalRequest.clientId]?.name}
            </h2>

            <div className="space-y-3">
              {modalRequest.products.map(p => (
                <div key={p.productId} className="border rounded-lg p-3">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm">Qty: {p.quantity}</p>
                  {p.variant && <p className="text-sm">Variant: {p.variant}</p>}
                  {p.specification && (
                    <p className="text-sm">Spec: {p.specification}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
