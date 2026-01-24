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
  products: { title: string; quantity: number }[];
  status: string;
  createdAt?: Timestamp;
}

interface FinalOrderProduct {
  title: string;
  quantity: number;
  price: number;
  baseTotal: number;
  margin: number;
  finalTotal: number;
}

interface FinalOrder {
  id: string;
  clientId: string;
  clientRequestId: string;
  products: FinalOrderProduct[];
  createdAt?: Timestamp;
}

export default function ClientDashboardPage() {
  const { user, isLoaded } = useUser();

  const [client, setClient] = useState<ClientProfile | null>(null);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [orders, setOrders] = useState<FinalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const load = async () => {
      const clientSnap = await getDocs(
        query(
          collection(db, "clients"),
          where("clerkUserId", "==", user.id),
          limit(1)
        )
      );

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

      const reqSnap = await getDocs(
        query(
          collection(db, "clientRequests"),
          where("clientId", "==", clientDoc.id),
          orderBy("createdAt", "desc")
        )
      );

      setRequests(
        reqSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ClientRequest, "id">),
        })).filter((r) => r.status !== "accepted")
      );

      const orderSnap = await getDocs(
        query(
          collection(db, "finalOrders"),
          where("clientId", "==", clientDoc.id),
        )
      );

      setOrders(
        orderSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FinalOrder, "id">),
        }))
      );

      setLoading(false);
    };

    load();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-Manrope">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-Manrope">
        Please sign in
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] pt-24 pb-16 font-Manrope">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <SignOutButton>
            <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg">
              Logout
            </button>
          </SignOutButton>
        </div>

        {client && (
          <section className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <p><span className="font-medium">Name:</span> {client.name}</p>
              <p><span className="font-medium">Email:</span> {client.email}</p>
              <p><span className="font-medium">Phone:</span> {client.phone}</p>
              <p><span className="font-medium">Address:</span> {client.address}</p>
            </div>
          </section>
        )}

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

          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white border rounded-xl p-5">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span className="capitalize">{req.status}</span>
                  {req.createdAt && (
                    <span>{req.createdAt.toDate().toLocaleString()}</span>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  {req.products.map((p, i) => (
                    <p key={i}>
                      {p.title} × {p.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Final Orders</h2>

          <div className="space-y-6">
            {orders.map((order) => {
              const supplierTotal = order.products.reduce(
                (sum, p) => sum + p.baseTotal,
                0
              );

              const finalTotal = order.products.reduce(
                (sum, p) => sum + p.finalTotal,
                0
              );

              const totalMargin = order.products.reduce(
                (sum, p) => sum + p.margin,
                0
              );

              return (
                <div
                  key={order.id}
                  className="bg-white border rounded-2xl p-6 space-y-4"
                >
                  <div className="space-y-2 text-sm">
                    {order.products.map((p, i) => (
                      <div
                        key={i}
                        className="flex justify-between border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">
                            ₹{p.price} × {p.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p>₹{p.baseTotal}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total</span>
                      <span>₹{supplierTotal}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">Margin</span>
                      <span className="text-green-600">₹{totalMargin}</span>
                    </div>

                    <div className="flex justify-between text-lg font-semibold">
                      <span>Final Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
