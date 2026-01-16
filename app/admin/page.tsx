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
  email?: string;
  phone?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [quotations, setQuotations] = useState<Record<string, Quotation[]>>({});
  const [modalRequest, setModalRequest] = useState<SupplierRequest | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [marginMap, setMarginMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const clientReqSnap = await getDocs(collection(db, "clientRequests"));
      setPendingCount(
        clientReqSnap.docs.filter((d) => d.data().status === "pending").length
      );

      const srQuery = query(
        collection(db, "supplierRequests"),
        where("status", "!=", "accepted")
      );

      const srSnap = await getDocs(srQuery);

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

      qSnap.docs.forEach((d) => {
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
    const marginValue = marginMap[q.id];
    if (!marginValue) {
      alert("Please enter margin before accepting");
      return;
    }

    const margin = Number(marginValue);

    const productsWithMargin = q.products.map((p) => {
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

    const related = quotations[q.supplierRequestId] || [];
    for (const other of related) {
      if (other.id !== q.id) {
        await updateDoc(doc(db, "quotations", other.id), { status: "lost" });
      }
    }

    await updateDoc(
      doc(db, "supplierRequests", q.supplierRequestId),
      { status: "accepted" }
    );


    setRequests((prev) =>
      prev.filter((r) => r.id !== q.supplierRequestId)
    );

    setQuotations((prev) => {
      const copy = { ...prev };
      delete copy[q.supplierRequestId];
      return copy;
    });
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/requests")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Requests ({pendingCount})
          </button>

          <button
            onClick={() => router.push("/admin/final-orders")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Final Orders
          </button>

          <SignOutButton>
            <button className="bg-red-600 text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((req) => {
          const client = clients[req.clientId];
          const qs = quotations[req.id] || [];

          return (
            <div key={req.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-medium">{client?.name}</h3>
              <p className="text-sm text-gray-600">{client?.address}</p>

              <button
                onClick={() => setModalRequest(req)}
                className="text-blue-600 text-sm mt-2"
              >
                View Request Details
              </button>

              <div className="mt-3 space-y-3">
                {qs.map((q) => (
                  <div key={q.id} className="border p-3 rounded">
                    <p className="font-medium">{q.supplierEmail}</p>

                    {q.products.map((p) => (
                      <p key={p.productId} className="text-sm">
                        {p.title}: ₹{p.price} × {p.quantity}
                      </p>
                    ))}

                    <input
                      type="number"
                      placeholder="Margin"
                      className="border px-2 py-1 w-full mt-2 rounded"
                      value={marginMap[q.id] || ""}
                      onChange={(e) =>
                        setMarginMap((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      onClick={() => acceptQuotation(q)}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded w-full"
                    >
                      Accept Quotation
                    </button>
                  </div>
                ))}

                {qs.length === 0 && (
                  <p className="text-sm text-gray-500">No quotations yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg relative">
            <button
              onClick={() => setModalRequest(null)}
              className="absolute top-2 right-3 text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-3">
              {clients[modalRequest.clientId]?.name}
            </h2>

            <ul className="space-y-2">
              {modalRequest.products.map((p) => (
                <li key={p.productId} className="border p-2 rounded">
                  <p className="font-medium">{p.title}</p>
                  <p>Qty: {p.quantity}</p>
                  {p.variant && <p>Variant: {p.variant}</p>}
                  {p.specification && <p>Spec: {p.specification}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
