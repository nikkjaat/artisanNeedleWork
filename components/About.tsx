"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function About() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section
      id="about"
      className={`min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-br from-lavender via-beige to-blush transition-opacity duration-300 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 sm:mb-6 leading-tight">
              Made with Heart,
              <br />
              <span className="text-rose block mt-2">Crafted with Care</span>
            </h2>

            <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
              <p className="text-text-light text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose">
                Every piece in our collection is thoughtfully handcrafted with
                love and attention to detail. We believe that the best gifts
                come from the heart, and each creation reflects that philosophy.
              </p>
              <p className="text-text-light text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose">
                From personalised embroidery hoops that tell your story, to
                hand-painted hankies that capture special moments, and adorable
                hair accessories that add charm to your day—we pour our passion
                into every stitch, brushstroke, and detail.
              </p>
            </div>

            <motion.button
              className="bg-white text-text-dark px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all font-medium text-sm sm:text-base w-full sm:w-auto border border-gray-200 hover:border-rose"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Our Story
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 lg:space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-rose rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg sm:text-xl lg:text-2xl">✨</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base sm:text-lg lg:text-xl text-text-dark mb-1 sm:mb-2">
                    Personalised Touch
                  </h3>
                  <p className="text-text-light text-xs sm:text-sm lg:text-base leading-relaxed">
                    Custom designs tailored to your story and preferences
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-lavender rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg sm:text-xl lg:text-2xl">🎨</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base sm:text-lg lg:text-xl text-text-dark mb-1 sm:mb-2">
                    Artisan Quality
                  </h3>
                  <p className="text-text-light text-xs sm:text-sm lg:text-base leading-relaxed">
                    Meticulously crafted using premium materials
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3 sm:gap-4 lg:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-beige rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-lg sm:text-xl lg:text-2xl">💝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base sm:text-lg lg:text-xl text-text-dark mb-1 sm:mb-2">
                    Perfect Gifts
                  </h3>
                  <p className="text-text-light text-xs sm:text-sm lg:text-base leading-relaxed">
                    Thoughtful presents for every special occasion
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
