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


  const selectedVariant = product.variants[selectedVariantIndex];

  return (
    <div>
      <TopSection title={product.title} />

      <main className="bg-[#F8F8F8] min-h-screen py-10 px-4 md:px-10 lg:px-20 text-[#1C1C1C] font-Int">
        <div className="flex flex-col lg:flex-row items-start gap-8">

          {/* PRODUCT IMAGES */}
          <div className="flex flex-col gap-4 w-full lg:w-1/2">
            {selectedVariant.images && selectedVariant.images.length > 1 ? (
              /* SPLIDE SLIDER IF MULTIPLE IMAGES */
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
                      <Image
                        src={imgSrc}
                        alt={selectedVariant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            ) : (
              /* SINGLE IMAGE IF NO ARRAY OR ONLY ONE IMAGE */
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


          {/* PRODUCT INFO */}
          <div className="flex-1">
            <h1 className="font-Play uppercase text-2xl md:text-3xl font-semibold mb-1">
              {product.title}
            </h1>

            <p className="italic text-[#555] text-sm mb-2">{product.category}</p>

            <p className="text-sm md:text-base text-[#333] leading-relaxed mb-3">
              {product.description}
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-3 mt-4 mb-8">
              <Link
                href="https://api.whatsapp.com/send?phone=918291527207"
                className="px-4 py-2 rounded-lg text-sm font-medium text-black bg-amber-300 border-1 border-gray-800 hover:opacity-70 transition"
              >
                Enquire Now
              </Link>

              <Link
                href="/products"
                className="px-4 py-2 rounded-lg text-sm font-medium border border-[#1C1C1C]/60 hover:bg-[#1C1C1C] hover:text-white transition"
              >
                Back to Products
              </Link>
            </div>

            {/* VARIANT SELECTOR */}
            <div className="mb-5">
              <h4 className="font-semibold text-base mb-1">Variants</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.name + idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs border ${idx === selectedVariantIndex
                        ? "bg-[#1C1C1C] text-white border-[#1C1C1C]"
                        : "bg-white text-[#1C1C1C] border-gray-300"
                      }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SELECTED VARIANT INFO */}
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
                      <span
                        key={spec + idx}
                        className="border border-[#1C1C1C]/50 rounded-lg px-3 py-1 text-xs hover:bg-[#1C1C1C] hover:text-white transition"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
