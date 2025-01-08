import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.div
          className="absolute -inset-1"
          animate={{
            background: [
              'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              'linear-gradient(45deg, #4ecdc4, #ff6b6b)',
              'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            borderRadius: '50%',
            filter: 'blur(8px)',
            opacity: 0.5,
          }}
        />
        <div className="relative flex items-center justify-center w-8 h-8 bg-white/10 rounded-full backdrop-blur-sm">
          <Heart className="w-6 h-6 text-rose-500 absolute animate-pulse" />
          <Activity className="w-6 h-6 text-cyan-400 absolute opacity-80" />
        </div>
      </div>
      <div className="flex flex-col">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ml-2 text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
        >
          OraCare
        </motion.span>
        <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium -mt-1">
           
        </span>
      </div>
    </motion.div>
  );
};

export default Logo;
