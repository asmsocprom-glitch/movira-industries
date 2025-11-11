"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopSection from "@/components/ui/TopSection";
import products from "@/app/lib/product.json";

const categories = [
  "All",
  "M.S Cuplock",
  "MS Pipes",
  "Aluminium Formwork",
  "Miscellaneous",
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div>
      <TopSection title="Collection" />

      <main className="bg-[#F8F8F8] min-h-screen py-16 px-4 md:px-12 lg:px-20 font-Int text-[#1C1C1C]">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 border-2 font-semibold uppercase tracking-wide transition duration-300 ${
                activeCategory === cat
                  ? "bg-[#1C1C1C] text-[#EAEAEA] border-[#1C1C1C]"
                  : "border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#EAEAEA]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 flex flex-col justify-between h-[220px]">
                <div>
                  <h2 className="font-Play uppercase text-lg mb-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-[#333333] leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-4 inline-block border-2 border-[#1C1C1C] text-[#1C1C1C] px-4 py-2 text-sm font-semibold tracking-wider hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-300 text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
