import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import FloatingButtons from "@/components/FloatingButtons";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StichKala - Personalised Embroidery & More",
  description:
    "Beautiful handmade gifts including personalised embroidery hoops, hand-painted hankies, and cute hair accessories. Each piece crafted with love.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} ${playfair.variable} font-sans`}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
          async
        />
        <Navbar />
        {children}
        <FloatingButtons />
      </body>
    </html>
  );
}
