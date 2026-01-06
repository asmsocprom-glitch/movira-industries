"use client";

import { useEffect, useState } from "react";
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

interface ProductRequest {
  id: string;
  clientId: string;
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  quantity: number;
  image: string;
  status: string;
}

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clientRequests"));
        const reqData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ProductRequest[];

        setRequests(reqData.filter((r) => r.status === "pending"));
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const rejectRequest = async (req: ProductRequest) => {
    if (!window.confirm("Reject this request?")) return;

    await updateDoc(doc(db, "clientRequests", req.id), {
      status: "rejected",
      rejectedAt: serverTimestamp(),
    });
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const acceptRequest = async (req: ProductRequest) => {
    if (!window.confirm("Approve & send to suppliers?")) return;

    await updateDoc(doc(db, "clientRequests", req.id), {
      status: "approved",
      approvedAt: serverTimestamp(),
    });

    await addDoc(collection(db, "supplierRequests"), {
      clientRequestId: req.id,
      clientId: req.clientId,
      product: {
        productId: req.productId,
        title: req.title,
        category: req.category,
        variant: req.variant,
        specification: req.specification,
        quantity: req.quantity,
        image: req.image,
      },
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8 font-Int">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Client Requests</h1>

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <ClientRequestCard
                key={req.id}
                req={req}
                rejectRequest={rejectRequest}
                acceptRequest={acceptRequest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ClientRequestCard = ({
  req,
  rejectRequest,
  acceptRequest,
}: {
  req: ProductRequest;
  rejectRequest: (req: ProductRequest) => void;
  acceptRequest: (req: ProductRequest) => void;
}) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      const snap = await getDoc(doc(db, "clients", req.clientId));
      if (snap.exists()) setClient(snap.data() as Client);
    };
    fetchClient();
  }, [req.clientId]);

  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-lg">
          {client?.name || "Unknown Client"}
        </h2>
        <p className="text-sm text-gray-600">
          {client?.email || "N/A"} | {client?.phone || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          {client?.address || "N/A"}
        </p>
      </div>

      <div className="flex gap-4">
        <div className="relative w-24 h-24 border rounded overflow-hidden">
          <Image
            src={req.image}
            alt={req.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h3 className="font-medium">{req.title}</h3>
          <p className="text-sm">
            <b>Category:</b> {req.category}
          </p>
          <p className="text-sm">
            <b>Variant:</b> {req.variant}
          </p>
          <p className="text-sm">
            <b>Spec:</b> {req.specification}
          </p>
          <p className="text-sm">
            <b>Qty:</b> {req.quantity}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => acceptRequest(req)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Approve
        </button>
        <button
          onClick={() => rejectRequest(req)}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AdminRequestsPage;
