import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-900 to-medical-primary-900">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about H.O.P.E? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-gray-300">
                  <Mail className="h-6 w-6 text-medical-primary-400" />
                  <span>contact@hope-medical.com</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <Phone className="h-6 w-6 text-medical-primary-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <MapPin className="h-6 w-6 text-medical-primary-400" />
                  <span>123 Medical Center Drive<br />Healthcare City, HC 12345</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <h2 className="text-2xl font-semibold text-white mb-6">Office Hours</h2>
              <div className="space-y-3 text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-primary-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-primary-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-primary-500"
                    placeholder="Your message..."
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-medical-primary-600 to-medical-primary-400 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(45, 212, 191, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
