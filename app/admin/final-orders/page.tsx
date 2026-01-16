"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Product {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  baseTotal: number;
  margin: number;
  finalTotal: number;
}

interface FinalOrder {
  id: string;
  supplierRequestId: string;
  supplierEmail: string;
  products: Product[];
  createdAt?: Timestamp;
}

export default function AdminFinalOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<FinalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, "finalOrders"));
      const data: FinalOrder[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FinalOrder, "id">),
      }));
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-6 min-h-screen">Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-6">Final Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No finalized orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const supplierTotal = order.products.reduce(
              (sum, p) => sum + p.baseTotal,
              0
            );

            const finalTotal = order.products.reduce(
              (sum, p) => sum + p.finalTotal,
              0
            );

            const margin = order.products[0]?.margin ?? 0;

            return (
              <div
                key={order.id}
                className="bg-white p-5 border rounded shadow-sm"
              >
                <div className="mb-3">
                  <p>
                    <strong>Supplier:</strong> {order.supplierEmail}
                  </p>
                  <p>
                    <strong>Supplier Total:</strong> ₹{supplierTotal}
                  </p>
                  <p>
                    <strong>Margin:</strong> ₹{margin}
                  </p>
                  <p className="text-lg font-semibold">
                    Final Price: ₹{finalTotal}
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-2">Products</p>
                  <ul className="ml-4 list-disc space-y-1">
                    {order.products.map((p) => (
                      <li key={p.productId}>
                        {p.title} × {p.quantity} @ ₹{p.price} = ₹
                        {p.baseTotal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
