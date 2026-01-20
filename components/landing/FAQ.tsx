"use client";

import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Do you provide consulting?",
    answer:
      "We provide end-to-end services, offering tailored solutions, professional drawings, and expert suggestions for every stage of your construction journey.",
  },
  {
    question: "Is the equipment checked before delivery?",
    answer:
      "Yes. Every piece of equipment is thoroughly inspected, cleaned, and maintained before dispatch to ensure it’s site-ready and safe to use.",
  },
  {
    question: "How do I know how much material I need?",
    answer:
      "If you’re unsure, our team can help estimate the quantity based on your site drawings or measurements. Just contact us with your project details.",
  },
  {
    question: "How do I become a vendor or partner with Movira Industries?",
    answer:
      "You can contact our office or email us with your company profile and requirements. We welcome long-term collaborations with reliable partners and contractors.",
  },
  {
    question: "How fast can you deliver scaffolding material in Mumbai?",
    answer:
      "Most standard scaffolding and formwork materials can be delivered within 24–48 hours across Mumbai and nearby areas.",
  },
];
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#F7F7F7] px-4 py-20 font-Manrope">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-4xl font-semibold text-[#1C1C1C]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-gray-600 text-base md:text-lg">
            Clear answers to common questions about our services and materials.
          </p>
          <div className="w-20 h-0.5 bg-[#C2A356] mx-auto mt-6" />
        </div>

        <div className="space-y-5">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm
                           hover:shadow-md transition-all duration-300"
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between
                             text-left text-base md:text-lg font-medium text-[#1C1C1C]"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="ml-4 text-[#C2A356]">
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
