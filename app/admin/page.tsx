"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";

interface Product {
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  image: string;
  quantity: string;
}

interface SupplierRequest {
  id: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  price?: string;
  products: Product[];
  status: string;
  approvedAt?: string;
}

function AdminDashboard() {
  const router = useRouter();
  const [supplierRequests, setSupplierRequests] =
    useState<SupplierRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierRequests = async () => {
      try {
        const q = query(
          collection(db, "supplierRequests"),
          orderBy("approvedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SupplierRequest[];
        setSupplierRequests(data);
      } catch (error) {
        console.error("Error fetching supplier requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierRequests();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8 font-Int">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/requests")}
            className="px-5 py-2 rounded-lg bg-black text-white text-sm"
          >
            Requests
          </button>

          <SignOutButton>
            <button className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4">Supplier Requests</h2>

        {loading ? (
          <p>Loading supplier requests...</p>
        ) : supplierRequests.length === 0 ? (
          <p className="text-gray-500">No supplier requests found</p>
        ) : (
          <div className="space-y-6">
            {supplierRequests.map((req) => {
              const hasPrice = !!req.price;
              return (
                <div
                  key={req.id}
                  className="bg-white border rounded-xl p-6 shadow-sm"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold">
                      {req.client.name}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {req.client.email} | {req.client.phone}
                    </p>

                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                          hasPrice
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {hasPrice
                          ? "Supplier Quoted"
                          : "Awaiting Supplier Price"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {req.products.map((product) => (
                      <div
                        key={product.productId}
                        className="flex gap-4 border rounded-lg p-3"
                      >
                        <div className="relative w-20 h-20 border rounded overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-medium">
                            {product.title}
                          </h4>

                          <p className="text-sm text-gray-600">
                            {product.category}
                          </p>

                          <p className="text-sm">
                            <b>Variant:</b> {product.variant}
                          </p>

                          <p className="text-sm">
                            <b>Spec:</b>{" "}
                            {product.specification}
                          </p>

                          <p className="text-sm">
                            <b>Quantity:</b>{" "}
                            {product.quantity}
                          </p>

                          {req.price ? (
                            <p className="text-sm text-green-600 font-semibold mt-1">
                              Price: ₹{req.price}
                            </p>
                          ) : (
                            <p className="text-sm text-orange-500 font-medium mt-1">
                              Awaiting supplier price
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
