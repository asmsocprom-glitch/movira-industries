"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";

interface Product {
  productId: string;
  title: string;
  variant: string;
  specification: string;
  quantity: string;
  image: string;
}

interface ClientRequest {
  id: string;
  clientId: string;
  products: Product[];
  status: "pending" | "accepted" | "rejected";
}

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const snap = await getDocs(collection(db, "clientRequests"));
      const pending = snap.docs
        .map(d => ({ id: d.id, ...d.data() })) as ClientRequest[];

      const filtered = pending.filter(r => r.status === "pending");

      const cache: Record<string, Client> = {};
      for (const r of filtered) {
        if (!cache[r.clientId]) {
          const clientSnap = await getDoc(doc(db, "clients", r.clientId));
          if (clientSnap.exists()) cache[r.clientId] = clientSnap.data() as Client;
        }
      }

      setClients(cache);
      setRequests(filtered);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAccept = async (req: ClientRequest) => {
    if (!confirm("Accept this request and send to suppliers?")) return;

    await updateDoc(doc(db, "clientRequests", req.id), { status: "accepted", acceptedAt: serverTimestamp() });
    await addDoc(collection(db, "supplierRequests"), {
      clientRequestId: req.id,
      clientId: req.clientId,
      products: req.products,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const handleReject = async (req: ClientRequest) => {
    if (!confirm("Reject this request?")) return;

    await updateDoc(doc(db, "clientRequests", req.id), { status: "rejected", rejectedAt: serverTimestamp() });
    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  if (loading)
    return <div className="min-h-screen flex items-center justify-center bg-[#f7f6f2] font-Manrope">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-Manrope px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pending Client Requests</h1>
          <button
            onClick={() => router.push("/admin")}
            className="px-6 py-2 text-sm  bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            ← Back
          </button>
        </div>
        {requests.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
            No pending client requests
          </div>
        )}

        {requests.map(req => {
          const client = clients[req.clientId];
          return (
            <div
              key={req.id}
              className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-lg">
                    {client?.name || "Unknown Client"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {client?.email} • {client?.phone}
                  </p>
                  <p className="text-sm text-gray-500">{client?.address}</p>
                </div>

                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 w-fit">
                  Pending
                </span>
              </div>

              <div className="grid gap-3">
                {req.products.map(p => (
                  <div
                    key={p.productId}
                    className="flex gap-4 border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden border bg-white">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="text-sm space-y-0.5">
                      <p className="font-medium">{p.title}</p>
                      <p className="text-gray-600">Variant: {p.variant}</p>
                      <p className="text-gray-600">Spec: {p.specification}</p>
                      <p className="text-gray-700 font-medium">
                        Quantity: {p.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleAccept(req)}
                  className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Accept & Send
                </button>
                <button
                  onClick={() => handleReject(req)}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
