import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoImage from '../Common/LogoImage';
import ThemeToggle from '../Common/ThemeToggle';
import { useEffect, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About Us' },
  { id: 'contact', label: 'Contact' }
];

export default function PublicNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    // Get the section from URL hash (e.g., #pricing -> pricing)
    const section = location.hash.replace('#', '');
    setActiveSection(section);

    // If no hash but on home page, default to first visible section
    if (!section && location.pathname === '/') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { threshold: 0.5 });

      navItems.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }
  }, [location]);

  const handleLogoClick = () => {
    navigate('/');
    setActiveSection('');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Update URL hash without scroll
    window.history.replaceState(null, '', `#${sectionId}`);
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button 
              onClick={handleLogoClick}
              className="hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <LogoImage type="hope" className="w-full h-full p-1" />
              </div>
            </button>
          </motion.div>
          
          {location.pathname !== '/auth' && (
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-3 py-2 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 ease-in-out ${
                    activeSection === item.id ? 'font-semibold' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
                      layoutId="navIndicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.a>
              ))}
              <ThemeToggle />
              <button
                onClick={() => navigate('/products')}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                View Products
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
