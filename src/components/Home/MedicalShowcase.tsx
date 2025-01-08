import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Image3D } from './Image3D';

const images = [
  {
    src: '/images/dental-scan.webp',
    alt: 'Advanced Dental Scanning',
    title: 'Precision Scanning',
    description: 'High-resolution imaging for accurate diagnosis',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    src: '/images/ai-analysis.webp',
    alt: 'AI-Powered Analysis',
    title: 'AI Analysis',
    description: 'Real-time detection of potential concerns',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    src: '/images/oral-health.webp',
    alt: 'Comprehensive Oral Health',
    title: 'Complete Care',
    description: 'Comprehensive oral health monitoring',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    src: '/images/doctor-patient.webp',
    alt: 'Doctor Patient Consultation',
    title: 'Expert Care',
    description: 'Professional guidance and support',
    gradient: 'from-orange-500 to-amber-500',
  }
];

const ImageCard: React.FC<{
  src: string;
  alt: string;
  title: string;
  description: string;
  gradient: string;
  index: number;
}> = ({ src, alt, title, description, gradient, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="relative">
        <Image3D src={src} alt={alt} className="w-full" />
        <motion.div 
          className="absolute inset-0 flex items-end p-6"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full">
            <div className={`w-full p-6 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-10 backdrop-blur-lg`}>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-200">{description}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const MedicalShowcase: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 pb-4">
            Experience the Future
          </h2>
          <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
            Our advanced AI technology combines with cutting-edge imaging to provide unparalleled oral health diagnostics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {images.map((image, index) => (
            <ImageCard key={image.title} {...image} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
