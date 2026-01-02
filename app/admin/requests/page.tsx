"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  image: string;
  quantity:string
}

interface Request {
  id: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  supplierId: string;
  products: Product[];
  createdAt?: string;
}

const AdminRequestsPage = () => {
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Request[];

        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const rejectProduct = async (
    request: Request,
    productId: string
  ) => {
    const confirm = window.confirm(
      "Do you want to reject this product?"
    );
    if (!confirm) return;

    const remainingProducts = request.products.filter(
      (p) => p.productId !== productId
    );

    try {
      if (remainingProducts.length === 0) {
        await deleteDoc(doc(db, "requests", request.id));
        setRequests((prev) =>
          prev.filter((r) => r.id !== request.id)
        );
      } else {
        await updateDoc(doc(db, "requests", request.id), {
          products: remainingProducts,
        });

        setRequests((prev) =>
          prev.map((r) =>
            r.id === request.id
              ? { ...r, products: remainingProducts }
              : r
          )
        );
      }
    } catch (error) {
      console.error("Reject product failed:", error);
    }
  };

  const acceptProduct = async (
    request: Request,
    product: Product
  ) => {
    const confirm = window.confirm(
      "Do you want to accept this product?"
    );
    if (!confirm) return;

    const remainingProducts = request.products.filter(
      (p) => p.productId !== product.productId
    );

    try {
      await addDoc(collection(db, "supplierRequests"), {
        client: request.client,
        products: [product],
        status: "pending",
        approvedAt: serverTimestamp(),
      });

      if (remainingProducts.length === 0) {
        await deleteDoc(doc(db, "requests", request.id));
        setRequests((prev) =>
          prev.filter((r) => r.id !== request.id)
        );
      } else {
        await updateDoc(doc(db, "requests", request.id), {
          products: remainingProducts,
        });

        setRequests((prev) =>
          prev.map((r) =>
            r.id === request.id
              ? { ...r, products: remainingProducts }
              : r
          )
        );
      }
    } catch (error) {
      console.error("Accept product failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-8 font-Int">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Client Requests
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-gray-600 underline mt-1"
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No client requests</p>
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
                  <p className="text-sm text-gray-600">
                    📧 {req.client.email} | 📞 {req.client.phone}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {req.products.map((product) => (
                    <div
                      key={product.productId}
                      className="border rounded-lg p-3"
                    >
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 border rounded overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium">
                            {product.title}
                          </h3>
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

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() =>
                            acceptProduct(req, product)
                          }
                          className="px-4 py-1 text-sm rounded bg-green-600 text-white"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() =>
                            rejectProduct(req, product.productId)
                          }
                          className="px-4 py-1 text-sm rounded bg-red-600 text-white"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestsPage;
