"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import products from "@/app/lib/product.json";

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="bg-[#F7F7F7] text-[#1C1C1C] py-20 px-4 md:px-12 lg:px-24 font-Manrope">
      <div className="text-center mb-16">
        <h2 className="text-[28px] md:text-4xl font-semibold tracking-wide mb-4">
          Featured Products
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          A quick look at some of our most trusted scaffolding, formwork, and
          fabrication systems built for safety and precision.
        </p>
        <div className="w-20 h-0.5 bg-[#C2A356] mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-xl overflow-hidden
                       shadow-sm hover:shadow-xl
                       transition-all duration-300"
          >
            <div className="relative w-full h-60 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-6 flex flex-col justify-between h-60">
              <div>
                <h3 className="uppercase text-lg tracking-wide text-[#1C1C1C] mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>

              <Link
                href={`/products/${product.slug}`}
                className="mt-6 inline-block text-center uppercase tracking-wider text-sm
                           border border-[#C2A356] text-[#C2A356]
                           px-4 py-2 rounded-sm
                           hover:bg-[#C2A356] hover:text-white
                           transition duration-300"
              >
                View Variants
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <Link
          href="/products"
          className="px-10 py-3 rounded-sm uppercase tracking-wider text-sm
                     bg-[#1C1C1C] text-white
                     hover:bg-[#C2A356] hover:text-black
                     transition duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
