import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, History, Settings, ChevronDown, ArrowRight, Activity, Users, Clock, Heart, Shield, Brain, Zap, LucideIcon } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring as useFramerSpring, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import { ParallaxText } from './ParallaxText';
import { FloatingElement } from './FloatingElement';
import { GradientCanvas } from './GradientCanvas';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

interface StatCardProps {
  value: number;
  label: string;
  icon: LucideIcon;
  delay?: number;
}

const ParallaxSection: React.FC<{ children: React.ReactNode; speed?: number }> = ({ children, speed = 0.5 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { tension: 300, friction: 10 };
  const { scale } = useSpring({
    scale: isHovered ? 1.05 : 1,
    config: springConfig
  });

  return (
    <animated.div
      ref={ref}
      style={{
        scale,
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(50px)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg transition-all duration-500"
    >
      <motion.div 
        className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-6"
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </motion.div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-lg">{description}</p>
    </animated.div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ value, label, icon: Icon, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [isHovered, setIsHovered] = useState(false);

  const { scale } = useSpring({
    scale: isHovered ? 1.05 : 1,
    config: config.wobbly
  });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(timer);
        }
        setAnimatedValue(Math.floor(current));
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <animated.div
      ref={ref}
      style={{ scale }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg"
    >
      <motion.div 
        className="flex items-center space-x-6"
        animate={{ y: isHovered ? -5 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.7 }}
        >
          <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <div>
          <motion.div 
            className="text-4xl font-bold text-gray-900 dark:text-white"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {animatedValue}+
          </motion.div>
          <div className="text-lg text-gray-600 dark:text-gray-300">{label}</div>
        </div>
      </motion.div>
    </animated.div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      onMouseMove={handleMouseMove}
    >
      {/* Hero Section */}
      <motion.div 
        ref={heroRef}
        style={{ y: parallaxY, opacity, scale }}
        className="relative min-h-screen flex items-center justify-center py-20"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-blue-500/10 to-transparent dark:from-blue-400/20"
            style={{
              x: mousePosition.x * -1,
              y: mousePosition.y * -1,
            }}
          />
        </div>

        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 
            className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 mb-8"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            H.O.P.E
          </motion.h1>
          
          <motion.p
            className="text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Advanced oral health screening platform
          </motion.p>

          <motion.button
            onClick={() => navigate('/analysis')}
            className="group relative inline-flex items-center px-8 py-4 text-lg font-medium rounded-full bg-blue-600 text-white overflow-hidden transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Analysis</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="ml-2 relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Stats Section with Parallax */}
      <ParallaxSection speed={-0.2}>
        <div className="relative py-32 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard value={1000} label="Patients Screened" icon={Users} delay={0.1} />
              <StatCard value={95} label="Accuracy Rate" icon={Activity} delay={0.2} />
              <StatCard value={24} label="Processing Time (sec)" icon={Clock} delay={0.3} />
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Features Section with Parallax */}
      <ParallaxSection speed={0.2}>
        <div className="relative py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Brain}
                title="AI-Powered Analysis"
                description="Advanced machine learning algorithms for accurate oral health assessment"
                delay={0.1}
              />
              <FeatureCard 
                icon={Zap}
                title="Real-time Processing"
                description="Get instant results with our high-performance processing system"
                delay={0.2}
              />
              <FeatureCard 
                icon={Shield}
                title="Secure & Private"
                description="Your data is protected with enterprise-grade security measures"
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
};

export default HomePage;
