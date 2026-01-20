"use client";
import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <main className="font-Manrope bg-[#f7f6f2] text-[#1C1C1C]">

      <section className="px-4 sm:px-8 md:px-16 lg:px-40 pt-20 pb-16">
        <div className="max-w-5xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            About Movira Industries
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-700 leading-relaxed">
            Delivering safe, reliable scaffolding and formwork solutions for
            India’s growing construction and infrastructure needs.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 lg:px-40 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-stretch">
          <div className="lg:col-span-5 flex">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1616320999187-3c004dad4f0b?auto=format&fit=crop&q=80&w=900"
                alt="Movira Industries Infrastructure"
                fill
                priority
                className="object-cover relative z-10"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 flex flex-col">
            <div className="bg-white border border-[#e6e6e6] rounded-2xl p-8 md:p-10 shadow-lg">
              <h2 className="text-3xl font-semibold">
                Movira Industries LLP
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[#C2A356]">
                Built with Trust
              </p>

              <p className="mt-6 text-gray-800 leading-relaxed">
                Movira Industries LLP is a trusted provider of scaffolding and
                formwork systems, supporting contractors, builders, and
                infrastructure developers across India with safe and dependable
                equipment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">
                  What We Provide
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Cuplock systems, adjustable props, mild steel accessories,
                  centering materials, and custom formwork solutions — all
                  inspected and site-ready.
                </p>
              </div>
              <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 shadow-md">
                <h3 className="font-semibold text-lg mb-2">
                  Why Choose Us
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We focus on quality, timely delivery, and long-term
                  partnerships — ensuring your projects stay safe, efficient,
                  and on schedule.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#e6e6e6] rounded-xl p-6 shadow-md mt-auto">
              <h3 className="font-semibold text-lg mb-4">
                Get in Touch
              </h3>

              <div className="space-y-2 text-sm text-gray-800">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  105 Commerce House, Kala Ghoda, Fort, Mumbai – 400001
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  <a href="tel:+918291527207" className="hover:text-[#C2A356]">
                    +91 82915 27207
                  </a>
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href="mailto:info@moviraindustries.in"
                    className="hover:text-[#C2A356]"
                  >
                    info@moviraindustries.in
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-40 pb-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6">
            Our Location
          </h3>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.667899030902!2d72.83241817494015!3d18.9392794822451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce3b55b803a9%3A0x94e2e03de508a4b!2sCommerce%20House%2C%20Kala%20Ghoda%2C%20Fort%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1730805000000!5m2!1sen!2sin"
            className="w-full h-[60vh] rounded-2xl border border-[#e5e5e5] shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

    </main>
  );
};

export default About;
