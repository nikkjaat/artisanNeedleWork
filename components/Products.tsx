'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { GiSewingNeedle, GiLipstick } from 'react-icons/gi';
import { GiHairStrands } from 'react-icons/gi';

export default function Products() {
  const products = [
    {
      title: 'Embroidery Hoops',
      description: 'Personalised embroidered designs perfect for home décor or heartfelt gifts. Each stitch tells your unique story.',
      icon: <GiSewingNeedle />,
      color: 'bg-blush',
    },
    {
      title: 'Hand-Painted Hankies',
      description: 'Delicate watercolor designs on soft cotton hankies. A thoughtful keepsake for special moments and memories.',
      icon: <GiLipstick />,
      color: 'bg-lavender',
    },
    {
      title: 'Hair Accessories',
      description: 'Adorable handmade bows, clips, and bands. Add a charming touch to your everyday style with these cute creations.',
      icon: <GiHairStrands />,
      color: 'bg-beige',
    },
  ];

  return (
    <section className="py-24 px-6 bg-cream">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-dark mb-4">
            Our Collection
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto">
            Each piece is lovingly handmade with attention to detail and care
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.title}
              {...product}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
