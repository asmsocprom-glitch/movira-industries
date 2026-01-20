'use client';

import React from 'react';
import { FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    message:
      "Good quality material and always on time. We use Movira for all our scaffolding needs now very professional people to deal with.",
    name: "Nikhilesh Jain",
    company: "Tarksyaa Techo Pvt. Ltd.",
  },
  {
    message:
      "Movira gives reliable service. Pipes and props were clean, strong, and delivered exactly when promised. No delays, no issues.",
    name: "Amit Sir",
    company: "Aum Sai Constructions",
  },
  {
    message:
      "Very good experience. Material was in top condition and delivered fast. Their team is polite and easy to talk to real professionals.",
    name: "Team MIPPL",
    company: "Mumbai, India",
  },
];

export default function ReviewComponent() {
  return (
    <section
      className="relative bg-[#ffffff] py-20 px-6 sm:px-12 md:px-20 lg:px-32 font-Manrope"
      aria-labelledby="client-reviews-heading"
    >
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2
          id="client-reviews-heading"
          className="text-[28px] md:text-4xl font-semibold text-[#1C1C1C]"
        >
          What Our Clients Say
        </h2>
        <p className="text-base sm:text-lg mt-3 text-gray-600">
          Real feedback from partners who trust Movira on-site.
        </p>
        <div className="w-20 h-0.5 bg-[#C2A356] mx-auto mt-6" />
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-7xl mx-auto">
        {reviews.map((review, index) => (
          <article
            key={index}
            className="relative bg-white p-8 rounded-xl 
                       border border-gray-200
                       shadow-sm hover:shadow-xl
                       transition-all duration-300
                       hover:-translate-y-1
                       w-full max-w-md"
            aria-label={`Client review by ${review.name}`}
          >
            <FaQuoteLeft className="text-[#C2A356] text-2xl mb-4 opacity-80" />

            <p className="text-base leading-relaxed text-justify text-gray-700 mb-6">
              {review.message}
            </p>

            <div className="border-t pt-4 border-gray-200">
              <p className="text-sm font-semibold text-[#1C1C1C]">
                {review.name}
              </p>
              <p className="text-sm text-gray-500">
                {review.company}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
