import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../Navigation/PublicNav';
import LogoImage from '../Common/LogoImage';

export default function ProjectLanding() {
  const navigate = useNavigate();

  const products = [
    {
      name: "OraCare",
      description: "Advanced oral health screening platform empowering healthcare professionals with quick, accurate assessments.",
      status: "available",
      gradient: "from-cyan-500 to-teal-500",
      textGradient: "from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400",
      shadowColor: "cyan",
      icon: "🦷"
    },
    {
      name: "O.D.D",
      description: "Oncological Diffrencal Diagnotics System - Advanced AI-powered diagnostic system for oral oncology.",
      status: "coming-soon",
      gradient: "from-purple-500 to-pink-500",
      textGradient: "from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400",
      shadowColor: "purple",
      icon: "🔬"
    },
    {
      name: "P.A.G.E.S",
      description: "Patient Analytics & Genomic Evaluation System - Comprehensive patient data analysis platform.",
      status: "coming-soon",
      gradient: "from-blue-500 to-indigo-500",
      textGradient: "from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400",
      shadowColor: "blue",
      icon: "📊"
    },
    {
      name: "E.A.S.Y",
      description: "Enhanced Automated Screening Yield - Streamlined screening process with automated workflows.",
      status: "coming-soon",
      gradient: "from-green-500 to-emerald-500",
      textGradient: "from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400",
      shadowColor: "green",
      icon: "⚡"
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth?mode=signup');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNav />
      
      <div className="container mx-auto px-4 py-32">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Our Products
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover our suite of advanced healthcare solutions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${product.gradient} opacity-10 dark:opacity-20 rounded-3xl blur-xl group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500`}
                />
                <div className="relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 h-full border border-gray-200 dark:border-gray-700/50 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-4xl mb-4">
                        {product.name === "OraCare" ? (
                          <LogoImage type="oracare" className="h-12" />
                        ) : (
                          <span>{product.icon}</span>
                        )}
                      </div>
                      <h3 className={`text-3xl font-bold bg-gradient-to-r ${product.textGradient} bg-clip-text text-transparent mb-3`}>
                        {product.name}
                      </h3>
                    </div>
                    {product.status === "coming-soon" ? (
                      <span className="px-3 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded-full border border-yellow-200 dark:border-yellow-700">
                        Coming Soon
                      </span>
                    ) : null}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-8">
                    {product.description}
                  </p>
                  {product.status === "available" ? (
                    <motion.button
                      onClick={handleGetStarted}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${product.gradient} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Started
                    </motion.button>
                  ) : (
                    <button
                      className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700/50 text-gray-400 rounded-xl font-semibold cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* More Products Coming Soon Message */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              More innovative healthcare solutions coming soon...
            </p>
          </motion.div>

          {/* Footer */}
          <footer className="mt-24 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-800/50">
            <div className="container mx-auto px-4 py-12">
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <p className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                    {new Date().getFullYear()} H.O.P.E Organization. All rights reserved.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap justify-center gap-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <a 
                    href="mailto:contact@hope.org" 
                    className="relative group px-6 py-2"
                  >
                    <span className="relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-200">
                      Contact Us
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200" />
                  </a>
                  <a 
                    href="/privacy" 
                    className="relative group px-6 py-2"
                  >
                    <span className="relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-200">
                      Privacy Policy
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200" />
                  </a>
                  <a 
                    href="/terms" 
                    className="relative group px-6 py-2"
                  >
                    <span className="relative z-10 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-200">
                      Terms of Service
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200" />
                  </a>
                </motion.div>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
