"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
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
      const pendingRequests = snap.docs
        .map(d => ({ id: d.id, ...d.data() })) as ClientRequest[];
      const filtered = pendingRequests.filter(r => r.status === "pending");

      const clientCache: Record<string, Client> = {};
      for (const r of filtered) {
        if (!clientCache[r.clientId]) {
          const clientSnap = await getDoc(doc(db, "clients", r.clientId));
          if (clientSnap.exists()) clientCache[r.clientId] = clientSnap.data() as Client;
        }
      }

      setClients(clientCache);
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

  if (loading) return <p className="p-6 min-h-screen">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8 font-Int">
      <div className="max-w-5xl mx-auto space-y-6">
        <button
          onClick={() => router.push("/admin")}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
        >
          &larr; Back to Dashboard
        </button>

        <h1 className="text-2xl font-semibold mb-4">Pending Client Requests</h1>

        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : requests.map(req => {
          const client = clients[req.clientId];
          return (
            <div key={req.id} className="bg-white border rounded-lg p-6 space-y-4">
              <div>
                <h2 className="font-semibold">{client?.name || "Unknown Client"}</h2>
                <p className="text-sm text-gray-600">{client?.email || "N/A"} | {client?.phone || "N/A"}</p>
                <p className="text-sm text-gray-600">{client?.address || "N/A"}</p>
              </div>

              <div className="space-y-2">
                {req.products.map(p => (
                  <div key={p.productId} className="flex gap-4 border rounded p-3">
                    <div className="relative w-20 h-20 border rounded overflow-hidden">
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm">Variant: {p.variant}</p>
                      <p className="text-sm">Spec: {p.specification}</p>
                      <p className="text-sm">Qty: {p.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-3">
                <button onClick={() => handleAccept(req)} className="px-4 py-2 bg-black text-white rounded">
                  Accept
                </button>
                <button onClick={() => handleReject(req)} className="px-4 py-2 border rounded">
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
