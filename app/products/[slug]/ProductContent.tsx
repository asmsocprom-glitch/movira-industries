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
        <div className="flex flex-col lg:flex-row items-start gap-8">


          <div className="flex flex-col gap-4 w-full lg:w-1/2">
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
                className="rounded-xl overflow-hidden"
              >
                {selectedVariant.images.map((imgSrc, idx) => (
                  <SplideSlide key={imgSrc + idx}>
                    <div className="relative w-full h-[340px] rounded-xl overflow-hidden border border-[#1C1C1C]/30 shadow-sm">
                      <Image src={imgSrc} alt={selectedVariant.name} fill className="object-cover" />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            ) : (
              <div className="relative w-full h-[340px] rounded-xl overflow-hidden border border-[#1C1C1C]/30 shadow-sm">
                <Image
                  src={
                    selectedVariant.images?.length === 1
                      ? selectedVariant.images[0]
                      : product.image
                  }
                  alt={selectedVariant.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>


          <div className="flex-1">
            <h1 className="font-Play uppercase text-2xl md:text-3xl font-semibold mb-1">
              {product.title}
            </h1>

            <p className="italic text-[#555] text-sm mb-2">{product.category}</p>

            <p className="text-sm md:text-base text-[#333] leading-relaxed mb-3">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-4 mb-8">
              <Link
                href="https://api.whatsapp.com/send?phone=918291527207"
                className="flex items-center px-4 py-2 text-sm font-semibold text-black bg-yellow-400 border border-gray-800 hover:bg-[#1C1C1C] hover:text-white transition"
              >
                Enquire Now
              </Link>

              <button
                onClick={handleAddToCart}
                className="flex items-center px-4 py-2 text-sm font-semibold border border-gray-800 hover:bg-[#1C1C1C] hover:text-white transition"
              >
                Add to Cart
              </button>

              <Link
                href="/products"
                className="flex items-center px-4 py-2 text-sm font-semibold border border-gray-800 hover:bg-[#1C1C1C] hover:text-white transition"
              >
                Back to Products
              </Link>
            </div>

            <div className="mb-5">
              <h4 className="font-semibold text-base mb-1">Variants</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.name + idx}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setSelectedSpecIndex(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs border ${
                      idx === selectedVariantIndex
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                        : "bg-white text-[#1C1C1C] border-gray-300"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 mx-1">
              <p className="text-sm text-[#333] mb-3 leading-relaxed">
                {selectedVariant.description}
              </p>

              <ul className="space-y-1.5 mb-4">
                {selectedVariant.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-[#1C1C1C] font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {selectedVariant.specifications?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Specifications:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVariant.specifications.map((spec, idx) => (
                      <button
                        key={spec + idx}
                        onClick={() => setSelectedSpecIndex(idx)}
                        className={`border rounded-lg px-3 py-1 text-xs transition ${
                          idx === selectedSpecIndex
                            ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                            : "border-[#1C1C1C]/50 hover:bg-[#1C1C1C] hover:text-white"
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-5">
              <h4 className="font-semibold text-base mb-1">Quantity</h4>
              <div className="flex">
                <input
                type="number"
                min={1}
                
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1 && value <= 100) {
                    setQuantity(value);
                  }
                }}

                className="w-24 border px-2 py-1 rounded"/>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
