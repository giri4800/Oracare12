import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoImage from './LogoImage';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const PublicNav: React.FC = () => {
  const { theme } = useTheme();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 bg-[#0F172A] dark:bg-[#0F172A] backdrop-blur-md z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <LogoImage type="oracare" variant="nav" />
            <span className="font-semibold tracking-wide text-white">
              ORA CARE
            </span>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default PublicNav;
