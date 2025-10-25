import Hero from "@/components/Hero";
import Shop from "@/components/Shop";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
  return (
    <main className="min-h-screen pt-20">
      <Hero />
      <Shop />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
