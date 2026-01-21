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
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#f7f6f2] font-Manrope">
        <div className="bg-white px-8 py-6 rounded-xl shadow-sm border">
          Loading final orders…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f7f6f2] font-Manrope px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Final Orders</h1>
            <p className="text-sm text-gray-500">
              All finalized supplier orders with margins
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
            className="px-5 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            ← Back
          </button>
        </div>

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
              className="bg-white border rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b bg-gray-50 flex flex-col lg:flex-row lg:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium">{order.supplierEmail}</p>
                  {order.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {order.createdAt.toDate().toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    Supplier Total
                    <div className="font-semibold">₹{supplierTotal}</div>
                  </div>

                  <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                    Total Margin
                    <div className="font-semibold text-yellow-700">
                      ₹{totalMargin}
                    </div>
                  </div>

                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    Final Price
                    <div className="font-semibold text-green-700">
                      ₹{finalTotal}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="font-medium mb-4">Products</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3 border-b">Product</th>
                        <th className="text-center px-4 py-3 border-b">Quantity</th>
                        <th className="text-right px-4 py-3 border-b">Per Product Price</th>
                        <th className="text-right px-4 py-3 border-b">Total Price</th>
                        <th className="text-right px-4 py-3 border-b">Margin</th>
                        <th className="text-right px-4 py-3 border-b">Final</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order.products.map((p) => (
                        <tr
                          key={p.productId}
                          className="border-b last:border-none hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">{p.title}</td>
                          <td className="px-4 py-3 text-center">{p.quantity}</td>
                          <td className="px-4 py-3 text-right">₹{p.price}</td>
                          <td className="px-4 py-3 text-right">₹{p.baseTotal}</td>
                          <td className="px-4 py-3 text-right text-yellow-700 font-medium">
                            ₹{p.margin}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            ₹{p.finalTotal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
