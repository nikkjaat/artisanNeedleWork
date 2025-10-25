'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you! We will get back to you soon.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-gradient-to-br from-blush via-lavender to-rose">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-text-dark mb-6">
            Let&apos;s Create Something Special
          </h2>
          <p className="text-text-light text-lg mb-12">
            Have a custom order in mind? We&apos;d love to bring your vision to life
          </p>

          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors"
              />

              <textarea
                name="message"
                placeholder="Tell us about your custom order..."
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-3xl border-2 border-gray-200 focus:border-rose focus:outline-none transition-colors resize-none"
              />

              {submitStatus.type && (
                <div
                  className={`p-4 rounded-2xl text-center ${
                    submitStatus.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rose text-white px-8 py-4 rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>

            <div className="mt-12 flex justify-center gap-6">
              <motion.a
                href="mailto:hello@example.com"
                className="w-14 h-14 bg-blush rounded-full flex items-center justify-center text-text-dark hover:bg-rose hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="text-xl" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-blush rounded-full flex items-center justify-center text-text-dark hover:bg-rose hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram className="text-xl" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-blush rounded-full flex items-center justify-center text-text-dark hover:bg-rose hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFacebook className="text-xl" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
