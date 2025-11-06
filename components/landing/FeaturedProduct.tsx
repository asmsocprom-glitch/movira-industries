"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

// Example featured data (replace or make dynamic later)
const featuredProducts = [
  {
    id: "cuplock-vertical-3m",
    title: "M.S Cuplock Vertical – 3M",
    description:
      "Durable 3-meter Cuplock Standard for maximum load-bearing strength and stability on tall structures.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
    category: "M.S Cuplock",
  },
  {
    id: "ledger-2m",
    title: "M.S Cuplock Ledger – 2M",
    description:
      "High-strength 2-meter ledger for reliable horizontal support in modular scaffolding systems.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
    category: "M.S Cuplock",
  },
  {
    id: "u-jack-600mm",
    title: "U Jack – 600mm",
    description:
      "Precision-threaded adjustable U Jack for accurate leveling and alignment on every site.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
    category: "M.S Cuplock",
  },
  {
    id: "formwork-slab",
    title: "Aluminium Formwork – Slab Panel",
    description:
      "Lightweight, durable aluminum Mivan panels ensuring precision casting and smooth concrete finish.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
    category: "Aluminium Formwork",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-[#EAE7DC] text-[#1C1C1C] py-16 px-4 md:px-12 lg:px-20 font-Int">
      <div className="text-center mb-12">
        <h2 className="font-Play text-3xl md:text-4xl uppercase font-semibold mb-3">
          Featured Products
        </h2>
        <p className="text-[#333333] text-base md:text-lg max-w-2xl mx-auto">
          A quick look at some of our most trusted scaffolding and formwork
          solutions, built for safety, strength, and precision.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            {/* Image */}
            <div className="relative w-full h-58">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between h-58">
              <div>
                <h3 className="font-Play uppercase text-lg mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-[#333333] leading-relaxed">
                  {product.description}
                </p>
              </div>


              <Link
                href={`/products/${product.id}`}
                className="font-Play mt-4 inline-block border-2 border-[#1C1C1C] rounded-sm text-[#1C1C1C] px-4 py-2 text-sm font-semibold tracking-wider hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-300 text-center"
              >
                Enquire Now
              </Link>
              
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-14">
        <Link
          href="/products"
          className="px-8 py-3 border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#EAEAEA] font-semibold uppercase tracking-wide hover:bg-transparent hover:text-[#1C1C1C] transition duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
