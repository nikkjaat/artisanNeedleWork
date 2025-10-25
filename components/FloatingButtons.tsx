"use client";

import { motion } from "framer-motion";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";

export default function FloatingButtons() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in your handcrafted gifts. Can you help me with a custom order?"
    );
    window.open(`https://wa.me/YOUR_PHONE_NUMBER?text=${message}`, "_blank");
  };

  const handleInstagramClick = () => {
    window.open(
      "https://www.instagram.com/vishakha_baliyan26?igsh=MXg3czd3YnBnbngzNg==",
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <motion.button
        onClick={handleInstagramClick}
        className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <FaInstagram className="text-3xl" />
      </motion.button>

      <motion.button
        onClick={handleWhatsAppClick}
        className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <FaYoutube className="text-3xl" />
      </motion.button>
    </div>
  );
}
