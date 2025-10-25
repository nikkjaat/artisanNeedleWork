"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Hero() {
  useEffect(() => {
    document.title = "ArtisanNeedleWork - Handcrafted Gifts";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Beautiful handmade gifts including personalised embroidery hoops, hand-painted hankies, and cute hair accessories. Each piece crafted with love."
      );
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blush via-lavender to-beige"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAyYy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-text-dark mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Handcrafted
            <br />
            <span className="text-rose">with Love</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-text-light max-w-2xl mx-auto mb-10 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Made with Love, Just for You 💌
            <br />
            Personalised embroidery hoops, hand-painted hankies & charming
            accessories — crafted to tell your story.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <button className="bg-rose text-white px-8 py-4 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl font-medium">
              Shop Now
            </button>
            <button className="bg-white text-text-dark px-8 py-4 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl font-medium">
              Customize Yours
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-serif text-rose">100+</p>
              <p className="text-sm text-text-light">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-rose">50+</p>
              <p className="text-sm text-text-light">Unique Designs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-rose">100%</p>
              <p className="text-sm text-text-light">Handmade</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-text-light"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
