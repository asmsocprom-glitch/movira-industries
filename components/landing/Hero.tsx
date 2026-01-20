"use client";

import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <main>
      <header className="relative w-full min-h-[80vh] font-Manrope flex items-center justify-center text-white">
        
        <Image
          src="/hero-new.jpg"
          alt="Construction and industrial supply"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/35 to-black/50" />
        <div className="relative z-10 max-w-6xl px-6 text-center flex flex-col items-center gap-6">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Built With Trust.
            <br />
            <span className="text-[#ddb95c]">
              Powered for Construction.
            </span>
          </h1>

          <p className="max-w-3xl text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed">
            Connecting suppliers and builders through a seamless
            digital marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/products"
              className="px-8 py-3 bg-[#ddb95c] text-black font-semibold rounded-sm hover:bg-[#b7974e] transition"
            >
              Explore Products
            </Link>
          </div>

        </div>
      </header>
    </main>
  );
}

export default Hero;
