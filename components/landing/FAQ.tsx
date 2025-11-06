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
      "We provide end-to-end services, we can come up with solutions for you, provide suggestions and create professional drawings to complete every chapter of your construction journey.",
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
    question: "How do I become a regular vendor or partner with Movira Industries?",
    answer:
      "You can contact our office or email us with your company profile and requirements. We welcome long-term collaborations with reliable partners and contractors.",
  },
  {
    question: "Where can I rent scaffolding and construction equipment in Mumbai?",
    answer:
      "You can rent high-quality scaffolding and formwork equipment in Mumbai directly from Movira Industries LLP. We supply cuplocks, props, ledgers, pipes, and accessories with fast delivery across Mumbai, Thane, and Navi Mumbai.",
  },
  {
    question: "What is the price of Cuplock scaffolding in Mumbai?",
    answer:
      "The price of Cuplock scaffolding depends on quantity and rental duration. We offer competitive rates with well-maintained, ready-to-use equipment. Contact us for a quick quotation and delivery schedule.",
  },
  {
    question: "Which is the best scaffolding rental company in Mumbai?",
    answer:
      "Movira Industries LLP is one of the most trusted scaffolding rental companies in Mumbai, known for its professional service, timely delivery, and durable equipment.",
  },
  {
    question: "What is the difference between Cuplock and H-frame scaffolding?",
    answer:"Cuplock scaffolding is a modular system ideal for large, heavy structures, while H-frame scaffolding is simpler and best for small to medium-height work. Movira Industries provides both options, depending on your project needs."
  },
  {
    question:"Do you supply adjustable props and centering materials?",
    answer:"Yes, we provide adjustable props, spans, and centering materials used for slab and shuttering support. All items are well-maintained and available for short- or long-term rental."
  },
  {
    question:"How fast can you deliver scaffolding material to a site in Mumbai?",
    answer:"Most of our standard scaffolding and formwork materials can be delivered within 24-48 hours in Mumbai and nearby areas."
  },
  {
    question:" Do you supply scaffolding for infrastructure or government projects?",
    answer:"Yes, Movira Industries has supplied scaffolding and formwork systems for major infrastructure projects including bridges, flyovers, and large building developments."
  },
  {
    question:"Why choose Movira Industries for scaffolding rental in Mumbai?",
    answer:"Because we focus on quality, professionalism, and on-time service. Every item is inspected, maintained, and delivered safely to help you finish your project on schedule."
  }
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
