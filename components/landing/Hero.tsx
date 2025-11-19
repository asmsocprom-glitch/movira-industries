'use client';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa6";
import { RxDoubleArrowDown } from "react-icons/rx";

function Hero() {
  
  const handleScroll = () => {
  const target = document.getElementById('about')
  if (!target) return
  if (window.innerWidth > 800 ) {
    target.scrollIntoView({ behavior: "smooth", block: "end" })
  } else {
    target.scrollIntoView({ behavior: "smooth" })
  }
}
  return (
    <main>
      {/* Hero Section with Background Image */}
      <header className="relative w-full h-screen text-[#EAEAEA] bg-[#EAE7DC]">
        <Image
          src="/hero-new.jpg"
          alt="Modern architectural building with sleek design"
          fill
          priority
          className="absolute inset-0 object-cover brightness-40"
        />
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center font-Play">
          <h1 className="text-3xl md:text-5xl leading-relaxed uppercase">
            Built with Trust.
          </h1>
          <p className="text-md sm:text-xl md:text-2xl max-w-[90%] sm:max-w-[80%] md:max-w-[50%] my-4 sm:my-6">
            Movira connects suppliers and builders through a seamless digital marketplace for all construction materials.
          </p>
          <Link
            aria-label="Schedule a 30-minute meeting "
            href="https://calendly.com/moviraindustries/30min"
            className="mt-4 px-4 py-2 text-md sm:px-10 sm:py-3 border-2 tracking-wider font-semibold border-[#EAEAEA] backdrop-blur-2xl hover:bg-[#1C1C1C] hover:border-[#1C1C1C] transition duration-300 "
          >
            Schedule a Meeting
          </Link>
          <button
              onClick={handleScroll}
              className=" h-8 lg:h-10 absolute bottom-32 md:bottom-8 animate-bounce"
            >
              <RxDoubleArrowDown className="w-full h-full" />
            </button>
          
        </div>
      </header>
      
      {/* About Section */}
      <section id='about' className="relative w-auto px-4 py-10 md:py-16 md:px-10 lg:px-34 text-[#1C1C1C] flex flex-col md:flex-row justify-center items-center gap-10 md:gap-30">
        {/* Left Content */}
        <div className="w-full md:w-[60%] py-10 md:py-20 rounded-xl">
          <div className="w-full">
            <header className="mb-4 leading-snug font-Play text-center sm:text-left">
              <h2 className="text-2xl sm:text-4xl font-semibold uppercase pb-2 tracking-wide">
               Best Scaffolding <br /> And Formwork <br />
              </h2>
              <h3 className="italic text-xl tracking-wide">
                Built with Trust
              </h3>
            </header>
            <div className="relative w-full mb-4 md:hidden aspect-[4/5] max-w-md border-4 border-[#1c1c1c]">
            <Image
              src="/about.jpg"
              alt="Beautifully designed interior living room"
              fill
              className="object-cover "
            />
          </div>
            <p className="text-base sm:text-lg text-center leading-relaxed font-Int sm:text-justify text-[#333333] mb-10">
              Movira Industries LLP is a trusted provider of scaffolding and formwork solutions, driving India’s construction growth with safe, reliable, and high-quality equipment. We ensure efficiency, safety, and precision on every site, helping build stronger, smarter infrastructure.
            </p>
            <Link
              href="/about"
              aria-label="Learn more about Movira Industries"
              className="group text-md py-2 w-max flex items-center px-6 mx-auto sm:mx-0 uppercase font-Int text-[#EAEAEA] bg-[#1C1C1C] cursor-pointer"
            >
              <span>More About Us</span>
              <FaArrowRight className="w-6 ml-4 text-[#EAEAEA] transform transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full md:w-[40%] hidden md:flex justify-center">
          <div className="relative w-full aspect-[4/5] max-w-md border-4 border-[#1c1c1c]">
            <Image
              src="/about.jpg"
              alt="Beautifully designed interior living room"
              fill
              className="object-cover "
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;
