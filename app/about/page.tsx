"use client";
import React from "react";
import Image from "next/image";
import TopSection from "@/components/ui/TopSection";

const About = () => {
  return (
    <main className="leading-relaxed text-[#1C1C1C] font-Int">
      {/* Hero */}
      <TopSection title="About Us" />

      {/* About Company */}
      <section className="flex flex-col lg:flex-row items-center justify-center gap-12 px-4 sm:px-8 md:px-16 lg:px-40 py-20">
        {/* Image / Illustration */}
        <div className="w-full lg:w-[40%] max-w-md relative group">
          <Image
            src="https://images.unsplash.com/photo-1616320999187-3c004dad4f0b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387"
            alt="Movira Industries Infrastructure"
            width={387}
            height={580}
            className="w-full h-auto object-cover shadow-2xl border-4 border-white rounded-md relative z-10"
          />

        </div>

        {/* Text */}
        <div className="w-full lg:w-[60%] bg-[#EAE7DC] p-8 md:p-12 shadow-lg hover:shadow-2xl rounded-2xl border border-[#d6d3c9] transition duration-300">
          <h2 className="text-3xl sm:text-4xl font-semibold font-Play uppercase mb-4 tracking-wide">
            Movira Industries LLP
          </h2>
          <p className="uppercase text-sm text-gray-600 font-Int mb-8 tracking-[0.15em]">
            Built with Trust.
          </p>

          <div className="space-y-6 text-base text-justify font-Int text-gray-800 leading-relaxed">
            <p>
              Movira Industries LLP is a premier provider of scaffolding and formwork
              solutions, powering India’s construction and infrastructure growth.
              We deliver high-quality, reliable, and safe equipment that caters to
              contractors, builders, and large-scale infrastructure developers.
            </p>

            <p>
              With a comprehensive range of rental and supply options including
              cuplock systems, adjustable props, mild steel accessories, and custom
              structural components we offer end-to-end solutions that enhance site
              efficiency and ensure worker safety. Every product is rigorously inspected, maintained, and ready for
              deployment, ensuring projects are executed with confidence, on time,
              and within budget.
            </p>

            <p>
              Backed by technical expertise, customer-first service, and a passion
              for quality, Movira Industries continues to strengthen its presence as
              a trusted partner in India’s construction ecosystem building stronger,
              safer, and smarter infrastructure for the future.
            </p>
          </div>

          {/* Contact Details */}
          <div className="mt-10 space-y-3 text-sm text-[#333] font-Int">
            <p>
              <strong>Address:</strong> 105 Commerce House, Kala Ghoda, Fort,
              Mumbai - 400001
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+918291527207"
                className="text-[#1C1C1C] hover:underline"
              >
                +91 82915 27207
              </a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@moviraindustries.in"
                className="text-[#1C1C1C] hover:underline"
              >
                info@moviraindustries.in
              </a>
            </p>
            <p>
              <strong>Instagram:</strong>{" "}
              <a
                href="https://www.instagram.com/moviraindustries/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1C1C1C] hover:underline"
              >
                @moviraindustries
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Embedded Google Map */}
      <div className="w-full h-[50vh] md:h-[80vh] relative px-4 sm:px-8 pb-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.667899030902!2d72.83241817494015!3d18.9392794822451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce3b55b803a9%3A0x94e2e03de508a4b!2sCommerce%20House%2C%20Kala%20Ghoda%2C%20Fort%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1730805000000!5m2!1sen!2sin"
          className="w-full h-full border-0 rounded-md"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Movira Industries Location"
        />
      </div>
    </main>
  );
};

export default About;
