import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import PublicNav from '../Navigation/PublicNav';
import LogoImage from '../Common/LogoImage';

export default function OraCareLanding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleStartAnalysis = () => {
    if (user) {
      navigate('/home');
    } else {
      navigate('/auth?mode=register');
    }
  };

  const features = [
    {
      title: "Quick Analysis",
      description: "Get rapid assessment results with our advanced screening technology",
      gradient: "from-cyan-500 to-teal-500",
      delay: 0.4
    },
    {
      title: "Patient History",
      description: "Comprehensive tracking of patient records and analysis history",
      gradient: "from-teal-500 to-cyan-500",
      delay: 0.6
    },
    {
      title: "Early Detection",
      description: "Advanced screening capabilities for early identification of oral health issues",
      gradient: "from-cyan-500 to-teal-500",
      delay: 0.8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-medical-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <PublicNav />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex flex-col items-center"
          >
            <h1 className="text-6xl font-bold text-white mb-4">H.O.P.E.</h1>
            <p className="text-xl text-gray-300">Advanced oral health screening platform</p>
          </motion.div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Revolutionizing Oral Healthcare
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Advanced oral health screening platform empowering healthcare professionals with quick, 
            accurate assessments and comprehensive patient history tracking.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay }}
              whileHover={{ y: -5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`} />
              <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 h-full transform transition-transform duration-300 group-hover:scale-[1.02]">
                <motion.div 
                  className="text-4xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: feature.delay + 0.2 }}
                >
                  {/* Removed icon */}
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative"
        >
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.button
            onClick={handleStartAnalysis}
            className="relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl text-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(45, 212, 191, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            {user ? 'Start New Analysis' : 'Start Analysis'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
