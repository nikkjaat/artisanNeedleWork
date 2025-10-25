'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  delay?: number;
}

export default function ProductCard({ title, description, icon, color, delay = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
    >
      <motion.div
        className={`w-20 h-20 ${color} rounded-full flex items-center justify-center mb-6 mx-auto`}
        whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
      >
        <div className="text-4xl">{icon}</div>
      </motion.div>

      <h3 className="font-serif text-2xl text-text-dark mb-4 text-center">
        {title}
      </h3>

      <p className="text-text-light text-center leading-relaxed">
        {description}
      </p>

      <motion.button
        className="mt-6 w-full bg-gradient-soft text-text-dark px-6 py-3 rounded-full hover:shadow-lg transition-all font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More
      </motion.button>
    </motion.div>
  );
}
