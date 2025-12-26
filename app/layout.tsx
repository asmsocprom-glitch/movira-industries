import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Playfair_Display, Instrument_Sans} from 'next/font/google';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { headers } from "next/headers";
const int = Instrument_Sans({
  variable: "--font-Int",
  subsets: ['latin'] });

const playfair = Playfair_Display({ 
  variable:"--font-Play",
  subsets: ['latin'] });


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 const headersList = await headers(); 
const pathname = headersList.get("x-pathname")?? "/";
const hideNavbar = pathname.startsWith("/supplier") || pathname.startsWith("/admin");
export const metadata: Metadata = {
  title: "Movira Industries",
  description: "Movira Industries LLP is a premier provider of scaffolding and formwork solutions, dedicated to powering India’s construction and infrastructure growth. We specialize in delivering high-quality, reliable, and safe equipment that meets the diverse needs of contractors, builders, and large-scale infrastructure developers.",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${int.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
        >
          {!hideNavbar && <Navbar />}
        <main className={!hideNavbar ? "pt-24" : ""}>{children}</main>
        {!hideNavbar && <Footer />}
          <a target="_blank" href="https://api.whatsapp.com/send?phone=918291527207" className="z-20 fixed bottom-10 right-6 md:right-10 rounded-full p-3 md:p-4 bg-[#2db742] transition-transform duration-200 hover:scale-110 hover:shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>
          </a>
        </body>
      </html>
    </ClerkProvider>
  );
}
