import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../Common/Logo';
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
      className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
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
              <Logo />
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
                <div key={item.id} className="relative">
                  <a 
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="text-gray-700 dark:text-gray-300 hover:text-medical-primary-600 transition-colors py-2"
                  >
                    {item.label}
                  </a>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 right-0"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    >
                      <svg 
                        className="absolute w-full -bottom-2" 
                        height="8" 
                        viewBox="0 0 32 8"
                        preserveAspectRatio="none"
                      >
                        <path 
                          d="M1 7C1 7 7 1 16 1C25 1 31 7 31 7"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              ))}
              <ThemeToggle />
              <button
                onClick={() => navigate('/products')}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
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
