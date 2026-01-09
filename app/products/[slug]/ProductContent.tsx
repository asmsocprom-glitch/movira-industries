"use client";

import Image from "next/image";
import Link from "next/link";
import TopSection from "@/components/ui/TopSection";
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
    if (selectedSpecIndex === null ) {
      alert("Please select variant and specification  ");
      return;
    }
    if(quantity == 0){
      alert("Please select quantity ");
      return;

    }

    const cartItem = {
      productId: product.id,
      title: product.title,
      category: product.category,
      variant: selectedVariant.name,
      specification: selectedVariant.specifications[selectedSpecIndex],
      image: selectedVariant.images?.[0] || product.image,
      quantity:quantity

    };


    const existingCart = localStorage.getItem("cartItems");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];


    cartItems.push(cartItem);


    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    alert("Added to cart successfully");
    setQuantity(0)
  };

  return (
    <div>
      <TopSection title={product.title} />

<main className="bg-[#F8F8F8] min-h-screen py-10 px-4 md:px-10 lg:px-20 text-[#1C1C1C] font-Int">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

    {/* LEFT: Product Images */}
    <div className="sticky top-28 self-start">
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
          className="rounded-xl overflow-hidden bg-white p-3"
        >
          {selectedVariant.images.map((imgSrc, idx) => (
            <SplideSlide key={imgSrc + idx}>
              <div className="relative w-full h-105">
                <Image src={imgSrc} alt={selectedVariant.name} fill className="object-contain" />
              </div>
            </SplideSlide>
          ))}
        </Splide>
      ) : (
        <div className="relative w-full rounded-xl  h-105 bg-white p-4">
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

    {/* RIGHT: Product Info */}
    <div className="bg-white rounded-xl p-6 shadow-sm">

      {/* Title */}
      <h1 className="font-Play uppercase text-2xl md:text-3xl font-semibold">
        {product.title}
      </h1>
      <p className="text-sm text-[#666] mt-1">{product.category}</p>

      {/* Description */}
      <p className="text-sm text-[#333] mt-4 leading-relaxed">
        {product.description}
      </p>

      {/* Variants */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2">Select Variant</h4>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v, idx) => (
            <button
              key={v.name + idx}
              onClick={() => {
                setSelectedVariantIndex(idx);
                setSelectedSpecIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs border transition ${
                idx === selectedVariantIndex
                  ? "bg-[#1C1C1C] text-white"
                  : "bg-white border-gray-300 hover:border-black"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Specifications */}
      {selectedVariant.specifications?.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-sm mb-2">Specifications</h4>
          <div className="flex flex-wrap gap-2">
            {selectedVariant.specifications.map((spec, idx) => (
              <button
                key={spec + idx}
                onClick={() => setSelectedSpecIndex(idx)}
                className={`px-4 py-2 text-xs rounded-md border transition ${
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

      {/* Quantity */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2">Quantity</h4>
        <input
          type="number"
          placeholder="Quantity"
          min={1}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 1 ) {
              setQuantity(value);
            }
          }}
          className="w-28 border border-gray-900 rounded-md px-3 py-2"
        />
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={handleAddToCart}
          className="px-6 py-3 text-sm font-semibold bg-[#1C1C1C] text-white hover:opacity-90 transition"
        >
          Add to Cart
        </button>

        <Link
          href="https://api.whatsapp.com/send?phone=918291527207"
          className="px-6 py-3 text-sm font-semibold border border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition"
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

      {/* Features */}
      <div className="mt-8 border-t pt-6">
        <h4 className="font-semibold text-sm mb-3">Key Features</h4>
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
</main>

    </div>
  );
}
