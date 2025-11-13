"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import products from "@/app/lib/product.json";

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="bg-[#EAE7DC] text-[#1C1C1C] py-16 px-4 md:px-12 lg:px-20 font-Int">
      <div className="text-center mb-12">
        <h2 className="font-Play text-3xl md:text-4xl uppercase font-semibold mb-3">
          Featured Products
        </h2>
        <p className="text-[#333333] text-base md:text-lg max-w-2xl mx-auto">
          A quick look at some of our most trusted scaffolding, formwork, and
          fabrication systems built for safety and precision.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative w-full h-60">
              <Image
                src={product.image[0]}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="p-5 flex flex-col justify-between h-72">
              <div>
                <h3 className="font-Play uppercase text-lg mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-[#333333] leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Link
                href={`/products/${product.slug}`}
                className="font-Play mt-4 inline-block border-2 border-[#1C1C1C] rounded-sm text-[#1C1C1C] px-4 py-2 text-sm font-semibold tracking-wider hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-300 text-center"
              >
                View Variants
              </Link>
            </div>
          </div>
        ))}
      </div>

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
