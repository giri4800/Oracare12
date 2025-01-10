import React from 'react';
import { motion } from 'framer-motion';

interface LogoImageProps {
  type: 'hope' | 'oracare';
  className?: string;
  variant?: 'default' | 'nav';
}

const LogoImage: React.FC<LogoImageProps> = ({ type, className = '', variant = 'default' }) => {
  const src = type === 'hope' 
    ? '/images/hope.svg'
    : '/images/oracare.png';
  
  const alt = type === 'hope' ? 'HOPE Logo' : 'OraCare Logo';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'nav':
        return 'rounded-lg';
      default:
        return '';
    }
  };
  
  return (
    <motion.img
      src={src}
      alt={alt}
      style={type === 'oracare' ? { 
        width: '48px', 
        height: '48px', 
        objectFit: 'contain',
        minHeight: '48px'
      } : undefined}
      className={`${getVariantClasses()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
};

export default LogoImage;
