"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useUser, SignOutButton } from "@clerk/nextjs";

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ClientRequest {
  id: string;
  products: { title: string; quantity: number | string }[];
  status: string;
  createdAt?: Timestamp;
}

export default function ClientDashboardPage() {
  const { user, isLoaded } = useUser();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchData = async () => {
      try {
        const clientQuery = query(
          collection(db, "clients"),
          where("clerkUserId", "==", user.id),
          limit(1)
        );
        const clientSnap = await getDocs(clientQuery);

        if (clientSnap.empty) {
          setLoading(false);
          return;
        }

        const clientDoc = clientSnap.docs[0];
        const clientData = clientDoc.data();
        setClient({
          id: clientDoc.id,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
        });

        // Fetch client requests
        const requestQuery = query(
          collection(db, "clientRequests"),
          where("clientId", "==", clientDoc.id),
          orderBy("createdAt", "desc")
        );
        console.log(requestQuery)

        const requestSnap = await getDocs(requestQuery);
        const requestData: ClientRequest[] = requestSnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ClientRequest, "id">),
        }));

        setRequests(requestData);
      } catch (err) {
        console.error("Client dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user]);

  if (!isLoaded) return null;
  if (!user) return <div className="pt-24 text-center h-screen">Please sign in to view your dashboard.</div>;
  if (loading) return <div className="pt-24 text-center h-screen">Loading dashboard...</div>;

  return (
    <div className="min-h-screen pt-24 pb-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 space-y-6">

        {/* Logout button */}
        <div className="flex justify-end">
          <SignOutButton>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Logout
            </button>
          </SignOutButton>
        </div>

        {client && (
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h1 className="text-2xl font-semibold mb-3">My Profile</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><span className="font-medium">Name:</span> {client.name}</p>
              <p><span className="font-medium">Email:</span> {client.email}</p>
              <p><span className="font-medium">Phone:</span> {client.phone}</p>
              <p><span className="font-medium">Address:</span> {client.address}</p>
            </div>
          </div>
        )}

        {/* Client Requests */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No requests found.</p>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-white border rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  {req.createdAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      {req.createdAt.toDate().toLocaleString()}
                    </p>
                  )}
                  <div className="mt-3 space-y-1 text-sm">
                    {req.products.map((p, i) => (
                      <p key={i}>
                        {p.title} — {p.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
