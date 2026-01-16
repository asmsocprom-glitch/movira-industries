"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Shop All", href: "/products" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const scrollToFooter = () => {
    document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
  };

  if (pathname.startsWith("/supplier") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full py-4 z-30 uppercase font-Play text-white bg-[#1C1C1C] shadow-lg">
      <div className="flex items-center justify-between mx-5 md:mx-10 lg:mx-20 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo2.png"
            alt="Movira Industries Logo"
            width={100}
            height={100}
            priority
            className="h-12 p-1 w-auto object-contain"
          />
          <span className="px-4 text-md lg:text-2xl">
            Movira Industries
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden sm:flex space-x-10 lg:space-x-18 tracking-wider text-sm lg:text-md">
          {navLinks.map(({ label, href }) => (
            <li key={label} className="relative group">
              <Link href={href} className="px-1">
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#C2A356] transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}

          <button onClick={scrollToFooter}>Contact Us</button>

          <Link href="/cart">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {isSignedIn ? (
            <Link href="/auth/redirect">PROFILE</Link>
          ) : (
            <Link href="/sign-in">SIGN IN</Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-50 flex flex-col justify-center items-center w-10 h-10 space-y-1"
          onClick={toggleMenu}
        >
          <span className={`h-0.5 w-6 bg-white transition ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`h-0.5 w-6 bg-white ${isOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-[#1C1C1C] z-50 transform transition-transform md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-500">
          <span className="text-xl">Menu</span>
          <button onClick={closeMenu}>✕</button>
        </div>

        <ul className="flex flex-col p-6 space-y-6">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link href={href} onClick={closeMenu}>
                {label}
              </Link>
            </li>
          ))}

          {isSignedIn ? (
            <Link href="/auth/redirect" onClick={closeMenu}>
              PROFILE
            </Link>
          ) : (
            <Link href="/sign-in" onClick={closeMenu}>
              SIGN IN
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
}
