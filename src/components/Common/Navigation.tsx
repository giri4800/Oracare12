import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoImage from './LogoImage';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    name: 'Add Patient',
    path: '/add-patient'
  },
  {
    name: 'Analyze',
    path: '/analysis'
  },
  {
    name: 'Dashboard',
    path: '/history'
  }
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const isActivePath = (item: NavItem) => {
    const currentPath = location.pathname.toLowerCase();
    const itemPath = item.path.toLowerCase();
    
    if (itemPath === '/') {
      return currentPath === itemPath;
    }
    
    return currentPath.startsWith(itemPath);
  };

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

          {/* Navigation Items */}
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.path}
                  className="relative inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-medical-primary-400 transition-colors duration-200"
                >
                  <span className="relative py-2">
                    {item.name}
                    {isActivePath(item) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-[3px] left-0 right-0"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      >
                        <svg 
                          className="absolute w-full" 
                          height="8"
                          viewBox="0 0 100 8"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0,0 L45,0 Q50,0 50,4 Q50,8 55,8 L100,8"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/logout"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
