"use client";

import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
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
  };
  products: Product[];
}

const Supplier = () => {
  const [requests, setRequests] = useState<SupplierRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, string>>({});
  //supplier page checking
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
        setRequests(data);
      } catch (error) {
        console.error("Error fetching supplier requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const ref = doc(db, "supplierRequests", requestId);
      await updateDoc(ref, {
        status: "accepted",
        price: prices[requestId],
      });

      // optional UI update (no refetch)
      setRequests((prev) =>
        prev.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8 font-Int">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Supplier Dashboard</h1>
          <SignOutButton>
            <button className="px-6 py-3 rounded-xl bg-black text-white">
              Sign out
            </button>
          </SignOutButton>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No requests found</p>
        ) : (
          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <div className="mb-4">
                  <h2 className="font-semibold text-lg">
                    {req.client.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        <h3 className="font-medium">{product.title}</h3>
                        <p className="text-sm text-gray-600">
                          {product.category}
                        </p>
                        <p className="text-sm">
                          <b>Variant:</b> {product.variant}
                        </p>
                        <p className="text-sm">
                          <b>Spec:</b> {product.specification}
                        </p>
                        <p className="text-sm">
                          <b>Quantity:</b> {product.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={prices[req.id] || ""}
                    onChange={(e) =>
                      setPrices({ ...prices, [req.id]: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-40"
                  />

                  <button
                    disabled={!prices[req.id]}
                    onClick={() => handleAccept(req.id)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      prices[req.id]
                        ? "bg-green-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Accept
                  </button>

                  <button className="px-4 py-2 rounded-lg border">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Supplier;
