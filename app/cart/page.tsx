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
      <div className="min-h-screen flex items-center justify-center">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-4 md:px-10 lg:px-20 py-10">
      <h1 className="text-2xl font-semibold mb-6">Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="bg-white border rounded-lg p-4 flex gap-4"
          >
            <div className="relative w-24 h-24 border rounded overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="text-sm">Variant: {item.variant}</p>
              <p className="text-sm">Spec: {item.specification}</p>
              <p className="text-sm">Qty: {item.quantity}</p>

              <button
                onClick={() => removeItem(item.productId)}
                className="mt-3 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleOrder}
        className="mt-8 px-6 py-3 bg-black text-white rounded"
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
