import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItem {
  name: string;
  path: string;
  matchPaths?: string[];
}

const navItems: NavItem[] = [
  { 
    name: 'Use Cases', 
    path: '/use-cases',
    matchPaths: ['/use-cases', '/use-cases/*']
  },
  { 
    name: 'Pricing', 
    path: '/pricing',
    matchPaths: ['/pricing', '/pricing/*']
  },
  { 
    name: 'About Us', 
    path: '/about',
    matchPaths: ['/about', '/about-us', '/about/*']
  },
  { 
    name: 'Contact', 
    path: '/contact',
    matchPaths: ['/contact', '/contact/*']
  }
];

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActivePath = (item: NavItem) => {
    const currentPath = location.pathname.toLowerCase();
    if (item.matchPaths) {
      return item.matchPaths.some(path => 
        currentPath === path.toLowerCase() || 
        currentPath.startsWith(path.toLowerCase() + '/')
      );
    }
    return currentPath === item.path.toLowerCase();
  };

  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="OraCare" className="h-8 w-8" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">OraCare</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = isActivePath(item);
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-white hover:text-medical-primary-600 dark:hover:text-medical-primary-400"
                >
                  <span className="relative py-2">
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navigation-indicator"
                        className="absolute left-0 right-0"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      >
                        <svg 
                          className="absolute -bottom-1 w-full" 
                          height="4" 
                          viewBox="0 0 40 4" 
                          preserveAspectRatio="none"
                        >
                          <path 
                            d="M0 3C10 3 10 1 20 1C30 1 30 3 40 3" 
                            stroke="#2563EB"
                            strokeWidth="2" 
                            fill="none"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <span className="sr-only">Toggle dark mode</span>
              {/* Add your dark mode toggle icon here */}
            </button>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563EB] hover:bg-blue-600"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
