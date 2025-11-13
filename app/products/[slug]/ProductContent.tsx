"use client";

import Image from "next/image";
import Link from "next/link";
import TopSection from "@/components/ui/TopSection";
import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

interface Variant {
  name: string;
  description: string;
  features: string[];
  specifications: string[];
}

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string[];
  variants: Variant[];
}

export default function ProductContent({ product }: { product: Product }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <TopSection title={product.title} />
      <main className="bg-[#F8F8F8] min-h-screen py-16 px-4 md:px-12 lg:px-24 text-[#1C1C1C] font-Int">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Product Image Section */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            {isMobile ? (
              <Splide
                options={{
                  type: "loop",
                  perPage: 1,
                  autoplay: true,
                  interval: 3500,
                  arrows: false,
                  pagination: true,
                }}
                className="rounded-2xl overflow-hidden"
              >
                {product.image.map((src) => (
                  <SplideSlide key={src}>
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-2 border-[#1C1C1C] shadow-lg">
                      <Image
                        src={src}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SplideSlide>
                ))}
              </Splide>
            ) : (
              product.image.map((src) => (
                <div
                  key={src}
                  className="relative w-full h-[400px] rounded-2xl overflow-hidden border-2 border-[#1C1C1C] shadow-lg"
                >
                  <Image
                    src={src}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h1 className="font-Play uppercase text-3xl md:text-4xl font-semibold mb-3">
              {product.title}
            </h1>
            <p className="italic text-[#333333] mb-2">{product.category}</p>

            <p className="text-base md:text-lg text-[#333333] mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants.map((variant, i) => (
              <div key={i} className="mb-10 border-b border-gray-300 pb-6">
                <h2 className="font-Play text-2xl uppercase mb-3">
                  {variant.name}
                </h2>
                <p className="text-[#333333] mb-4">{variant.description}</p>

                <ul className="space-y-2 mb-4">
                  {variant.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#1C1C1C] font-bold">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {variant.specifications?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Specifications:</h4>
                    <div className="flex flex-wrap gap-3">
                      {variant.specifications.map((spec) => (
                        <span
                          key={spec}
                          className="border border-[#1C1C1C] rounded-xl px-4 py-2 text-sm hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-200 cursor-pointer"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="https://api.whatsapp.com/send?phone=918291527207"
                className="px-6 py-3 border-2 border-[#1C1C1C] bg-[#1C1C1C] text-[#EAEAEA] font-semibold uppercase tracking-wide hover:bg-transparent hover:text-[#1C1C1C] transition duration-300"
              >
                Enquire Now
              </Link>
              <Link
                href="/products"
                className="px-6 py-3 border-2 border-[#1C1C1C] text-[#1C1C1C] font-semibold uppercase tracking-wide hover:bg-[#1C1C1C] hover:text-[#EAEAEA] transition duration-300"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
