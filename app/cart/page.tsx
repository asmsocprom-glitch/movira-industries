"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";


interface CartItem {
  productId: string;
  title: string;
  category: string;
  variant: string;
  specification: string;
  image: string;
  status?: string;
  quantity:string
}

function Page() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      const items: CartItem[] = JSON.parse(storedItems).map((item: CartItem) => ({
        ...item,
        status: "No Action",
      }));
      setCartItems(items);
    }
  }, []);

  const handleDelete = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };


  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    console.log("data is here")

    try {
      await addDoc(collection(db, "requests"), {
        client: {
          name,
          email,
          phone,
          address
        },
        products: cartItems,
        createdAt: Timestamp.now(),

      });
      console.log("data passed")
      alert(
        "Request successful! You will be notified on your email or phone number."
      );

      localStorage.removeItem("cartItems");
      setCartItems([]);
      setShowForm(false);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] px-4 md:px-10 lg:px-20 py-10 font-Int">
      <h1 className="text-2xl font-semibold mb-6">Add to Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 bg-white border rounded-lg p-4"
          >
            <div className="relative w-24 h-24 border rounded-md overflow-hidden">
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
              <p className="text-sm mt-1">
                <span className="font-medium">Variant:</span> {item.variant}
              </p>
              <p className="text-sm">
                <span className="font-medium">Specification:</span>{" "}
                {item.specification}
              </p>
              <p className="text-sm">
                <span className="font-medium">Quantity:</span>{" "}
                {item.quantity}
              </p>

              <button
                onClick={() => handleDelete(item.productId)}
                className="mt-3 text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>


      <button
        onClick={() => setShowForm(true)}
        className="mt-8 px-6 py-3 bg-black text-white rounded-lg"
      >
        Send Request
      </button>


      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmitRequest}
            className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-lg font-semibold">Your Details</h2>

            <input
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              required
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              required
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                {loading ? "Sending..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Page;
