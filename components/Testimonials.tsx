'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    text: 'The embroidery hoop I ordered was absolutely stunning! The attention to detail was incredible, and it made the perfect gift for my best friend\'s wedding.',
    rating: 5,
  },
  {
    name: 'Emily Chen',
    text: 'I\'ve never seen such beautiful hand-painted hankies. They\'re delicate, thoughtful, and arrived perfectly packaged. Will definitely order again!',
    rating: 5,
  },
  {
    name: 'Lisa Martinez',
    text: 'The hair accessories are adorable! My daughter wears them every day. The quality is outstanding and they hold up beautifully.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 px-6 bg-cream">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark mb-4">
            Loved by Our Customers
          </h2>
          <p className="text-text-light text-lg">
            Hear what our community has to say
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-12 max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <span key={i} className="text-rose text-2xl">★</span>
              ))}
            </div>

            <p className="text-text-dark text-xl text-center leading-relaxed mb-8 font-light italic">
              &quot;{testimonials[activeIndex].text}&quot;
            </p>

            <p className="text-center text-text-light font-medium">
              — {testimonials[activeIndex].name}
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-rose w-8' : 'bg-gray-300'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
