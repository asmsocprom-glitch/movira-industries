"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import products from "@/app/lib/product.json";

const categories = [
  "All",
  "Scaffolding System",
  "Formwork System",
  "Steel Fabrication",
  "Accessories",
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="font-Manrope bg-[#f7f6f2] text-[#1C1C1C]">
      <section className="px-4 sm:px-8 md:px-16 lg:px-40 pt-20 pb-24">
        <div className="flex flex-wrap gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide
                border transition-all duration-300
                ${
                  activeCategory === cat
                    ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                    : "bg-white text-[#1C1C1C] border-[#d6d6d6] hover:border-[#C2A356] hover:text-[#C2A356]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-[#e6e6e6]
                         shadow-sm hover:shadow-xl transition-all duration-300
                         flex flex-col overflow-hidden"
            >
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div>
                  <h2 className="uppercase text-base font-semibold tracking-wide mb-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="mt-auto inline-block text-center uppercase tracking-wider text-sm font-semibold
                             border border-[#C2A356] text-[#C2A356]
                             px-5 py-2 rounded-sm
                             hover:bg-[#C2A356] hover:text-black
                             transition duration-300"
                >
                  View Variants
                </Link>
              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
