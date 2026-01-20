"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

interface Variant {
  name: string;
  description: string;
  features: string[];
  specifications: string[];
  images?: string[];
}

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  variants: Variant[];
}

export default function ProductContent({ product }: { product: Product }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSpecIndex, setSelectedSpecIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(0);

  const selectedVariant = product.variants[selectedVariantIndex];

  const handleAddToCart = () => {
    if (selectedSpecIndex === null) {
      alert("Please select specification");
      return;
    }
    if (quantity === 0) {
      alert("Please select quantity");
      return;
    }

    const cartItem = {
      productId: product.id,
      title: product.title,
      category: product.category,
      variant: selectedVariant.name,
      specification: selectedVariant.specifications[selectedSpecIndex],
      image: selectedVariant.images?.[0] || product.image,
      quantity,
    };

    const existingCart = localStorage.getItem("cartItems");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    alert("Added to cart successfully");
    setQuantity(0);
  };

  return (
    <main className="font-Manrope bg-[#f7f6f2] text-[#1C1C1C]">
      <section className="px-4 sm:px-8 md:px-16 lg:px-40 pt-24 pb-14">
        <div className="max-w-6xl">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-wide text-gray-600">
            {product.category}
          </p>
          <p className="mt-4 max-w-6xl text-lg text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>
      </section>
      <section className="px-4 sm:px-8 md:px-16 lg:px-40 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky lg:top-32 self-start">
            {selectedVariant.images && selectedVariant.images.length > 1 ? (
              <Splide
                options={{
                  type: "loop",
                  perPage: 1,
                  autoplay: true,
                  interval: 3500,
                  arrows: false,
                  pagination: true,
                }}
                className="bg-white rounded-2xl border border-[#e6e6e6] p-4"
              >
                {selectedVariant.images.map((img, idx) => (
                  <SplideSlide key={img + idx}>
                    <div className="relative w-full h-105">
                      <Image
                        src={img}
                        alt={selectedVariant.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            ) : (
              <div className="relative w-full h-105 bg-white rounded-2xl border border-[#e6e6e6] p-4">
                <Image
                  src={
                    selectedVariant.images?.length === 1
                      ? selectedVariant.images[0]
                      : product.image
                  }
                  alt={selectedVariant.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[#e6e6e6] p-8 shadow-sm">
            <div>
              <h4 className="text-sm font-semibold mb-3">Select Variant</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.name + idx}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setSelectedSpecIndex(null);
                    }}
                    className={`px-4 py-2 text-xs rounded-full border transition
                      ${
                        idx === selectedVariantIndex
                          ? "bg-[#1C1C1C] text-white"
                          : "bg-white border-gray-300 hover:border-[#C2A356] hover:text-[#C2A356]"
                      }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
            {selectedVariant.specifications?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Specifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVariant.specifications.map((spec, idx) => (
                    <button
                      key={spec + idx}
                      onClick={() => setSelectedSpecIndex(idx)}
                      className={`px-4 py-2 text-xs rounded-md border transition
                        ${
                          idx === selectedSpecIndex
                            ? "bg-[#1C1C1C] text-white"
                            : "border-gray-300 hover:bg-[#1C1C1C] hover:text-white"
                        }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Quantity</h4>
              <input
                type="number"
                min={1}
                placeholder="Qty"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1) setQuantity(value);
                }}
                className="w-28 border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:border-black"
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 text-sm font-semibold bg-[#1C1C1C] text-white hover:opacity-90 transition"
              >
                Add to Cart
              </button>

              <Link
                href="https://api.whatsapp.com/send?phone=918291527207"
                className="px-6 py-3 text-sm font-semibold border border-[#C2A356] text-[#C2A356]
                           hover:bg-[#C2A356] hover:text-black transition"
              >
                Enquire Now
              </Link>

              <Link
                href="/products"
                className="px-6 py-3 text-sm font-semibold border border-gray-300 hover:border-black transition"
              >
                Back to Products
              </Link>
            </div>
            <div className="mt-10 border-t pt-6">
              <h4 className="text-sm font-semibold mb-4">Key Features</h4>
              <ul className="space-y-2">
                {selectedVariant.features.map((feature, idx) => (
                  <li key={idx} className="text-sm flex gap-2">
                    <span className="font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
