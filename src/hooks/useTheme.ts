import { useState, useEffect } from 'react';

// Create a global function to apply theme
const applyThemeToDocument = (isDark: boolean) => {
  // Apply to root element
  document.documentElement.classList.toggle('dark', isDark);
  
  // Apply to body
  document.body.classList.toggle('dark', isDark);
  
  // Store in localStorage
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Force update all Tailwind classes
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme ? savedTheme === 'dark' : prefersDark;
  });

  // Apply theme whenever it changes
  useEffect(() => {
    applyThemeToDocument(isDark);
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return { isDark, toggleTheme };
}
