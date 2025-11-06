"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopSection from "@/components/ui/TopSection";

// Product Data (condensed version from your inventory — you can expand later)
const allProducts = [
  // M.S Cuplock
  {
    id: "cuplock-vertical-3m",
    title: "M.S Cuplock Vertical – 3M",
    category: "M.S Cuplock",
    description:
      "Durable 3-meter MS Cuplock Standard for tall scaffolding structures. Ensures maximum load-bearing strength and stability.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },
  {
    id: "cuplock-ledger-2m",
    title: "M.S Cuplock Ledger – 2M",
    category: "M.S Cuplock",
    description:
      "High-strength ledger providing horizontal support and rigidity for modular scaffolding systems.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },
  {
    id: "u-jack-600mm",
    title: "U Jack – 600mm",
    category: "M.S Cuplock",
    description:
      "Adjustable U Jack for leveling and height adjustment in scaffolding systems. Precision threaded for smooth use.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },

  // MS Pipes
  {
    id: "pipe-c-channel-6m",
    title: "MS C Channel – 6M",
    category: "MS Pipes",
    description:
      "6-meter mild steel C Channel for large-scale construction and fabrication projects.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },
  {
    id: "pipe-round-6m",
    title: "MS Round Pipe – 6M",
    category: "MS Pipes",
    description:
      "Heavy-duty 6-meter MS round pipe ideal for scaffolding and structural support.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },

  // Aluminium Formwork
  {
    id: "formwork-slab",
    title: "Aluminium Formwork – Slab",
    category: "Aluminium Formwork",
    description:
      "Durable Mivan panels ensuring speed, precision, and smooth concrete finishes.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },
  {
    id: "formwork-wall",
    title: "Aluminium Formwork – Wall",
    category: "Aluminium Formwork",
    description:
      "Robust aluminium formwork panels for fast and consistent wall casting in modern construction.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },

  // Miscellaneous
  {
    id: "walkway-jali",
    title: "Walkway Jali",
    category: "Miscellaneous",
    description:
      "Anti-slip galvanized MS walkway jali for safe and stable site movement.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },
  {
    id: "h-frame",
    title: "H Frame",
    category: "Miscellaneous",
    description:
      "Rigid MS H Frame used for plastering, painting, and façade work with quick setup and strong alignment.",
    image: "https://images.unsplash.com/photo-1519143009590-e3800b9df468?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=784",
  },
];

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
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
  <div>
    <TopSection title="Collection" />
    <main className="bg-[#F8F8F8] min-h-screen py-16 px-4 md:px-12 lg:px-20 font-Int text-[#1C1C1C]">
      {/* Header */}
      {/* <div className="text-center mb-12">
        <h1 className="font-Play text-3xl md:text-4xl uppercase font-semibold mb-4">
          Our Product Collection
        </h1>
        <p className="text-[#333333] max-w-2xl mx-auto text-base md:text-lg">
          Explore our complete range of scaffolding, formwork, and construction
          equipment built for durability and precision.
        </p>
      </div> */}

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

      {/* Products Grid */}
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
                href={`/products/${product.id}`}
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
