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
    question: "Where can I rent scaffolding and construction equipment in Mumbai?",
    answer:
      "You can rent high-quality scaffolding and formwork equipment directly from Movira Industries LLP. We supply cuplocks, props, ledgers, pipes, and accessories with fast delivery across Mumbai, Thane, and Navi Mumbai.",
  },
  {
    question: "What is the difference between Cuplock and H-frame scaffolding?",
    answer:
      "Cuplock scaffolding is modular and ideal for heavy-duty structures, while H-frame scaffolding is simpler and best for smaller-scale work. Movira Industries provides both depending on your project needs.",
  },
  {
    question: "Do you supply adjustable props and centering materials?",
    answer:
      "Yes, we provide adjustable props, spans, and centering materials used for slab and shuttering support. All items are well-maintained and available for rent.",
  },
  {
    question: "How fast can you deliver scaffolding material in Mumbai?",
    answer:
      "Most standard scaffolding and formwork materials can be delivered within 24–48 hours across Mumbai and nearby areas.",
  },
  {
    question: "Do you supply for infrastructure or government projects?",
    answer:
      "Yes, Movira Industries has supplied scaffolding and formwork systems for major infrastructure projects including bridges, flyovers, and large building developments.",
  },
  {
    question: "Why choose Movira Industries for scaffolding rental?",
    answer:
      "Because we focus on quality, professionalism, and on-time service. Every item is inspected, maintained, and delivered safely to help you complete your project efficiently.",
  },
];


function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFAQ = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="h-auto flex justify-center px-4 py-16 bg-[#EAE7DC]">
      <div className="w-full max-w-6xl">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-Play font-semibold text-[#1c1c1c] pb-12 text-center tracking-wide">
          Frequently Asked Questions
        </h3>

<div className="grid grid-cols-1 gap-4 md:gap-6">
  {faqData.map((faq, index) => (
    <div
      key={index}
      className={`rounded-xl border border-gray-300 shadow-sm transition-all duration-300 hover:shadow-md ${
        openIndex === index ? "bg-[#f7f5f0]" : "bg-[#f7f5f0]"
      }`}
    >
      <button
        aria-expanded={openIndex === index}
        aria-controls={`faq-${index}`}
        className="w-full py-3 px-4 flex items-center justify-between text-left text-sm sm:text-base font-medium focus:outline-none transition-all cursor-pointer"
        onClick={() => toggleFAQ(index)}
      >
        <span
          className={`${
            openIndex === index ? "text-[#1c1c1c]" : "text-gray-700"
          }`}
        >
          {faq.question}
        </span>
        {openIndex === index ? (
          <FiMinus className="text-lg text-[#1c1c1c]" />
        ) : (
          <FiPlus className="text-lg text-gray-600" />
        )}
      </button>

      <div
        id={`faq-${index}`}
        className={`overflow-hidden text-gray-600 text-sm sm:text-base transition-all duration-300 ease-in-out ${
          openIndex === index ? "max-h-[300px] pb-3 px-4" : "max-h-0"
        }`}
        style={{ transitionProperty: "max-height, padding" }}
      >
        <p className="leading-relaxed">{faq.answer}</p>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}

export default FAQ;
