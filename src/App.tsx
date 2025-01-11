import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, History, Settings, LayoutDashboard, Menu, LogOut, Users, Activity } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useAuthStore } from './stores/useAuthStore';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './components/Home/HomePage';
import AuthForm from './components/Auth/AuthForm';
import PatientHistory from './components/History/HistoryPage';
import PatientDetail from './components/Patient/PatientDetail';
import AddPatient from './components/Patient/AddPatient';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PhotoUpload from './components/Analysis/PhotoUpload';
import AnalysisDetail from './components/Analysis/AnalysisDetail';
import ProjectLanding from './components/Home/ProjectLanding';
import OraCareLanding from './components/Products/OraCareLanding';
import LandingPage from './components/Landing/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';
import LogoImage from './components/Common/LogoImage';

const App: React.FC = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const { user, loading, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  // Hide navigation on public pages
  const isPublicPage = ['/', '/auth', '/products', '/oracare', '/landing'].includes(location.pathname);

  // Only redirect to login if trying to access protected routes
  useEffect(() => {
    const isProtectedRoute = ['/home', '/analysis', '/history', '/add-patient', '/patient'].some(
      route => location.pathname.startsWith(route)
    );
    
    if (!loading && !user && isProtectedRoute) {
      navigate('/auth?mode=login', { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200 bg-white dark:bg-gray-900">
      {user && !isPublicPage && (
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-[#0F172A] shadow-lg z-50 border-b border-gray-200 dark:border-gray-800">
          <nav className="max-w-7xl mx-auto bg-white dark:bg-[#0F172A] px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center justify-between h-full">
              <Link
                to="/home"
                className="flex items-center space-x-2"
              >
                <LogoImage type="oracare" variant="nav" />
                <span className="text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
                  ORA CARE
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  to="/add-patient"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  <Users className="w-5 h-5" />
                  <span>Add Patient</span>
                </Link>
                <Link
                  to="/analysis"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  <Camera className="w-5 h-5" />
                  <span>Analyze</span>
                </Link>
                <Link
                  to="/history"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  <Activity className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </div>

              {/* Right side items */}
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>

              <button
                className="md:hidden text-gray-200 hover:text-medical-primary-400"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="md:hidden"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link
                      to="/add-patient"
                      className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-medical-primary-400"
                    >
                      <Users className="w-5 h-5" />
                      <span className="ml-2">Add Patient</span>
                    </Link>
                    <Link
                      to="/analysis"
                      className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-medical-primary-400"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="ml-2">Analyze</span>
                    </Link>
                    <Link
                      to="/history"
                      className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-medical-primary-400"
                    >
                      <Activity className="w-5 h-5" />
                      <span className="ml-2">History</span>
                    </Link>
                    <div className="px-3 py-2 flex justify-between items-center">
                      <ThemeToggle />
                      <button
                        onClick={handleLogout}
                        className="text-gray-200 hover:text-medical-primary-400"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </header>
      )}

      <main className={user && !isPublicPage ? 'pt-16' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProjectLanding />} />
          <Route path="/oracare" element={<OraCareLanding />} />
          <Route path="/auth" element={<AuthForm />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><PhotoUpload /></ProtectedRoute>} />
          <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisDetail /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><PatientHistory /></ProtectedRoute>} />
          <Route path="/add-patient" element={<ProtectedRoute><AddPatient /></ProtectedRoute>} />
          <Route path="/patient/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;