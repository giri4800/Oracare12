import React from 'react';
import { motion } from 'framer-motion';
import LogoImage from './LogoImage';
import { useLocation } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <LogoImage type={isLandingPage ? 'hope' : 'oracare'} />
    </motion.div>
  );
};

export default Logo;
