'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-text-dark text-white py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-rose">StichKala</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Creating beautiful, personalised pieces with love and care. Each item is a unique
              work of art made just for you.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-rose transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-rose transition-colors">Custom Orders</a></li>
              <li><a href="#" className="hover:text-rose transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-rose transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Stay Connected</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for updates on new collections and special offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-full bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-rose text-sm"
              />
              <motion.button
                className="bg-rose px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join
              </motion.button>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} StichKala. Handmade with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
