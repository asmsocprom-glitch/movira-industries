'use client'
import React from 'react'
import Image from 'next/image'

interface TopSec {
  title: string
}

function TopSection({ title }: TopSec) {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden text-[#EAEAEA]">
      {/* Background Image */}
      <Image
        src="/otherhero.jpg"
        fill
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover brightness-40"
        priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/70 via-transparent to-transparent z-0" />

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center font-Play">
        <h1 className="text-4xl md:text-5xl leading-snug md:leading-relaxed uppercase tracking-wide ">
          {title}
        </h1>
        <div className="w-26 h-[2px] bg-[#C2A356] mt-3 " />
      </div>
    </div>
  )
}

export default TopSection
