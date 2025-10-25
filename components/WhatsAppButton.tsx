'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent('Hi! I\'m interested in your handcrafted gifts. Can you help me with a custom order?');
    window.open(`https://wa.me/YOUR_PHONE_NUMBER?text=${message}`, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <FaWhatsapp className="text-3xl" />
    </motion.button>
  );
}
