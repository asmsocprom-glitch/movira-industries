"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

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

        const requestQuery = query(
          collection(db, "clientRequests"),
          where("clientId", "==", clientDoc.id),
          orderBy("createdAt", "desc")
        );

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-Manrope">
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-Manrope">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] pt-24 pb-16 font-Manrope">
      <div className="max-w-6xl mx-auto px-4 space-y-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>

          <SignOutButton>
            <button className="px-4 py-2 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition">
              Logout
            </button>
          </SignOutButton>
        </div>

        {/* PROFILE CARD */}
        {client && (
          <section className="bg-white border border-[#e6e6e6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <p><span className="font-medium">Name:</span> {client.name}</p>
              <p><span className="font-medium">Email:</span> {client.email}</p>
              <p><span className="font-medium">Phone:</span> {client.phone}</p>
              <p><span className="font-medium">Address:</span> {client.address}</p>
            </div>
          </section>
        )}

        {/* REQUESTS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Requests</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-[#C2A356] hover:underline"
            >
              + Create New Request
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white border border-dashed rounded-xl p-8 text-center">
              <p className="text-gray-600 mb-4">
                You haven’t placed any requests yet.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-[#e6e6e6] rounded-xl p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize font-medium ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.status}
                    </span>

                    {req.createdAt && (
                      <span className="text-xs text-gray-500">
                        {req.createdAt.toDate().toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-gray-800">
                    {req.products.map((p, i) => (
                      <p key={i}>
                        {p.title} <span className="text-gray-500">× {p.quantity}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
