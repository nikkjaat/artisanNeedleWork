import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <Products />
        <About />
        <Testimonials />
        <Contact />
        <Footer />
        {/* <WhatsAppButton /> */}
      </main>
    </>
  );
}
