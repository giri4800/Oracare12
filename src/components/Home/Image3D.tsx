import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Image3DProps {
  src: string;
  alt: string;
  className?: string;
}

export const Image3D: React.FC<Image3DProps> = ({ src, alt, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: isHovered ? mousePosition.y * -20 : 0,
        rotateY: isHovered ? mousePosition.x * 20 : 0,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(50px)',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
        />
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(20px)',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'translateZ(30px)',
          }}
          animate={{
            opacity: isHovered ? 0.3 : 0,
          }}
        />
      </div>
    </motion.div>
  );
};
