"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "All Products" },
    { href: "/track", label: "Track Order" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm ">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/">
            <motion.div
              className="font-serif text-2xl md:text-3xl text-text-dark cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <img src="/logo.png" alt="Logo" className="h-12 w-12" />
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className="text-text-dark hover:text-rose transition-colors font-medium cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-text-dark text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-6"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="text-text-dark hover:text-rose transition-colors font-medium block cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
