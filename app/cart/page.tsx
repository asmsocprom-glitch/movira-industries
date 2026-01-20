"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Link from "next/link";

interface CartItem {
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  image: string;
  quantity: string;
}

export default function CartPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cartItems");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  const removeItem = (productId: string) => {
    const updated = cartItems.filter((i) => i.productId !== productId);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const handleOrder = async () => {
    if (!isSignedIn || !user) {
      alert("You must be signed in to place an order.");
      router.push("/sign-in");
      return;
    }

    if (!cartItems.length) return;

    setLoading(true);

    try {
      const clientQuery = query(
        collection(db, "clients"),
        where("clerkUserId", "==", user.id)
      );
      const clientSnap = await getDocs(clientQuery);

      if (clientSnap.empty) {
        alert("Client profile not found. Please complete your profile first.");
        router.push("/complete-profile");
        setLoading(false);
        return;
      }
      const clientId = clientSnap.docs[0].id;
      await addDoc(collection(db, "clientRequests"), {
        clientId,
        products: cartItems,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      alert("Request sent successfully");
      localStorage.removeItem("cartItems");
      setCartItems([]);
    } catch (err) {
      console.error("Order error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex flex-col items-center font-Manrope justify-center bg-[#f7f6f2] text-center px-4">
        <h2 className="text-2xl font-semibold mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Looks like you haven’t added any products yet. Explore our collection
          to get started.
        </p>

        <Link
          href="/products"
          className="px-6 py-3 text-sm font-semibold border border-[#1C1C1C]
                     hover:bg-[#1C1C1C] hover:text-white transition"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] px-4 md:px-10 lg:px-32 py-8 font-Manrope">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold pt-10 mb-8">Your Cart</h1>
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl border border-[#e6e6e6] p-5 flex gap-5"
            >
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>

                <div className="mt-2 text-sm space-y-1">
                  <p><span className="font-medium">Variant:</span> {item.variant}</p>
                  <p><span className="font-medium">Spec:</span> {item.specification}</p>
                  <p><span className="font-medium">Qty:</span> {item.quantity}</p>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={handleOrder}
            disabled={loading}
            className="px-8 py-3 bg-[#1C1C1C] text-white text-sm font-semibold
                       hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>

          <Link
            href="/products"
            className="px-8 py-3 border border-gray-400 text-sm font-semibold
                       hover:border-black transition"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
