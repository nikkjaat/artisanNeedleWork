"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-6 bg-gradient-to-br from-lavender via-beige to-blush"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-text-dark mb-6">
              Made with Heart,
              <br />
              <span className="text-rose">Crafted with Care</span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed mb-6">
              Every piece in our collection is thoughtfully handcrafted with
              love and attention to detail. We believe that the best gifts come
              from the heart, and each creation reflects that philosophy.
            </p>
            <p className="text-text-light text-lg leading-relaxed mb-8">
              From personalised embroidery hoops that tell your story, to
              hand-painted hankies that capture special moments, and adorable
              hair accessories that add charm to your day—we pour our passion
              into every stitch, brushstroke, and detail.
            </p>
            <motion.button
              className="bg-white text-text-dark px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Our Story
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-text-dark mb-2">
                    Personalised Touch
                  </h3>
                  <p className="text-text-light">
                    Custom designs tailored to your story and preferences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lavender rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-text-dark mb-2">
                    Artisan Quality
                  </h3>
                  <p className="text-text-light">
                    Meticulously crafted using premium materials
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💝</span>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-text-dark mb-2">
                    Perfect Gifts
                  </h3>
                  <p className="text-text-light">
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
