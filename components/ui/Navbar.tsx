"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Search, ShoppingCart } from "lucide-react";
import productsData from "@/app/lib/product.json";

interface NavLink {
  label: string;
  href: string;
}
interface SearchItem {
  id: string;
  slug: string;
  title: string;
}

const navLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
    document.body.style.overflow = !isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }
   useEffect(() => {
    if (!search.trim()) {
      setResults([])
      return
    }
    const filtered = productsData.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    )
    setResults(
      filtered.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
      }))
    )
  }, [search])

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/supplier")
  ) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full font-Manrope  z-40 bg-[#1C1C1C] text-white shadow-lg">
      <div className="flex items-center justify-between px-5 md:px-10 lg:px-12 h-20">

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="Movira Industries Logo"
            width={48}
            height={48}
            priority
          />
          <span className="text-lg lg:text-2xl  font-semibold tracking-wide">
            MOVIRA INDUSTRIES 
          </span>
        </Link>
        <div className="hidden md:flex flex-1 mx-10 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-2.5 rounded-md bg-[#2A2A2A] border border-gray-700"
          />
          {results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[#2A2A2A] border border-gray-700 rounded-md overflow-hidden z-50">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(`/products/${item.slug}`);
                    setSearch("");
                    setResults([]);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#3A3A3A] border-b border-gray-700">
                    <span className="text-sm font-medium ">{item.title}</span>
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
        <ul className="hidden md:flex items-center gap-8 uppercase text-sm tracking-wider">
          {navLinks.map(link => (
            <li key={link.label} className="relative">
              <Link href={link.href} className="pb-1">
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-[#C2A356]" />
                )}
              </Link>
            </li>
          ))}

          <Link href="/cart">
            <ShoppingCart className="w-6 h-6" />
          </Link>

          {isSignedIn ? (
            <Link href="/auth/redirect">Profile</Link>
          ) : (
            <Link href="/sign-in">Sign In</Link>
          )}
        </ul>

        <button
          className="md:hidden flex flex-col space-y-1"
          onClick={toggleMenu}
        >
          <span className={`h-0.5 w-6 bg-white transition ${isOpen && "rotate-45 translate-y-1.5"}`} />
          <span className={`h-0.5 w-6 bg-white ${isOpen && "opacity-0"}`} />
          <span className={`h-0.5 w-6 bg-white transition ${isOpen && "-rotate-45 -translate-y-1.5"}`} />
        </button>
      </div>

      <div className="md:hidden px-5 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 rounded-md bg-[#2A2A2A] border border-gray-700"
          />
          {results.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[#2A2A2A] border border-gray-700 rounded-md overflow-hidden z-50">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(`/products/${item.slug}`);
                    setSearch("");
                    setResults([]);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#3A3A3A] border-b border-gray-700">
                    <span className="text-sm font-medium ">{item.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-[#121212] z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={closeMenu}
          aria-label="Close menu"
          className="absolute top-6 right-6 text-white text-3xl"
        >
          ✕
        </button>
        <nav className="flex flex-col justify-center pl-8 h-full gap-6 text-white uppercase text-lg tracking-wider">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className={`relative pb-1 transition-colors ${
                isActive(link.href)
                  ? "text-[#C2A356] after:w-full"
                  : "after:w-0"
              } after:absolute after:left-0 after:bottom-0  after:bg-[#C2A356] after:transition-all`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/cart"
            onClick={closeMenu}
            className={`relative pb-1 ${
              isActive("/cart") ? "text-[#C2A356] after:w-full" : "after:w-0"
            } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-[#C2A356] after:transition-all`}
          >
            Cart
          </Link>

          {isSignedIn ? (
            <Link
              href="/auth/redirect"
              onClick={closeMenu}
              className={`relative pb-1 ${
                isActive("/auth/redirect")
                  ? "text-[#C2A356] after:w-full"
                  : "after:w-0"
              } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-[#C2A356] after:transition-all`}
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/sign-up"
              onClick={closeMenu}
              className={`relative pb-1 ${
                isActive("/sign-up")
                  ? "text-[#C2A356] after:w-full"
                  : "after:w-0"
              } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-[#C2A356] after:transition-all`}
            >
              Sign Up
            </Link>
          )}
        </nav>
      </div>
    </nav>
  );
}
