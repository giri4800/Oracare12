import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './components/Theme';
import { useTheme } from './components/Theme/useTheme';
import { Sun, Moon, Home, Camera, History, Settings } from 'lucide-react';
import PhotoUpload from './components/Analysis/PhotoUpload';
import HistoryPage from './components/History/HistoryPage';
import HomePage from './components/Home/HomePage';
import SettingsPage from './components/Settings/Settings';
import AuthForm from './components/Auth/AuthForm';
import { useAuthStore } from './stores/useAuthStore';

const Layout = () => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen bg-${theme === 'dark' ? 'gray-900' : 'gray-50'}`}>
      <Navigation />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/analyze" element={<ProtectedRoute><PhotoUpload /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <AuthForm />;
};

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuthStore();
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-${theme === 'dark' ? 'gray-900' : 'white'} border-b border-${theme === 'dark' ? 'gray-800' : 'gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-2 py-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className={`ml-2 text-xl font-bold text-${theme === 'dark' ? 'white' : 'gray-900'}`}>
                OralScan AI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <React.Fragment>
                <Link 
                  to="/" 
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-${theme === 'dark' ? 'gray-100' : 'gray-900'} hover:bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} transition-colors duration-200`}
                >
                  <Home size={20} className="mr-2" />
                  Home
                </Link>
                
                <Link 
                  to="/analyze" 
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-${theme === 'dark' ? 'gray-100' : 'gray-900'} hover:bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} transition-colors duration-200`}
                >
                  <Camera size={20} className="mr-2" />
                  Analyze
                </Link>
                
                <Link 
                  to="/history" 
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-${theme === 'dark' ? 'gray-100' : 'gray-900'} hover:bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} transition-colors duration-200`}
                >
                  <History size={20} className="mr-2" />
                  History
                </Link>
                
                <Link 
                  to="/settings" 
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-${theme === 'dark' ? 'gray-100' : 'gray-900'} hover:bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} transition-colors duration-200`}
                >
                  <Settings size={20} className="mr-2" />
                  Settings
                </Link>
                
                <button
                  onClick={signOut}
                  className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-${theme === 'dark' ? 'gray-100' : 'gray-900'} hover:bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} transition-colors duration-200`}
                >
                  Sign Out
                </button>
              </React.Fragment>
            )}
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg text-${theme === 'dark' ? 'gray-400' : 'gray-500'} hover:bg-${theme === 'dark' ? 'gray-800' : 'gray-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}

export default App;