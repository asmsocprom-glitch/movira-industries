'use client';

import React from 'react';

const reviews = [
  {
    message:
      "Good quality material and always on time. We use Movira for all our scaffolding needs now very professional people to deal with.",
    name: "Nikhilesh Jain<br />Tarksyaa Techo Pvt. Ltd.",
  },
  {
    message:
      "Movira gives reliable service. Pipes and props were clean, strong, and delivered exactly when promised. No delays, no issues.",
    name: "Amit Sir<br />Aum Sai Constructions",
  },
  {
    message:
      "Very good experience. Material was in top condition and delivered fast. Their team is polite and easy to talk to real professionals.",
    name: "Team MIPPL<br />Mumbai, India",
  },
];

export default function ReviewComponent() {
  return (
    <section
      className="relative py-20 px-6 sm:px-12 md:px-20 lg:px-32"
      aria-labelledby="client-reviews-heading"
    >
      {/* Heading */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
        <h2
          id="client-reviews-heading"
          className="text-[26px] md:text-4xl font-Play font-semibold text-[#1c1c1c]"
        >
          What Our Clients Say
        </h2>
        <p className="font-Int text-base sm:text-lg mt-3 text-zinc-600">
          What our clients say after trusting us with their vision.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center font-Int max-w-7xl mx-auto">
        {reviews.map((review, index) => (
          <article
            key={index}
            className="p-8 rounded-2xl border border-zinc-400 
                       bg-white/90 backdrop-blur-sm 
                       shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
                       hover:shadow-[0_8px_28px_rgba(194,163,86,0.25)] 
                       hover:-translate-y-1 transition-all w-full sm:w-[90%] lg:w-[95%] max-w-md"
            aria-label={`Client review by ${review.name}`}
          >
            <p className="text-base leading-relaxed text-zinc-800">
              {review.message}
            </p>
            <p
              className="mt-5 text-sm font-semibold tracking-wide text-right text-[#C2A356]"
              dangerouslySetInnerHTML={{ __html: `- ${review.name}` }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
