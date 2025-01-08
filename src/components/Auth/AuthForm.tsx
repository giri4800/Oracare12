import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuthStore } from '../../stores/useAuthStore';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const isLogin = mode !== 'signup';

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();

  const handleModeChange = () => {
    if (isLogin) {
      navigate('/auth?mode=signup', { replace: true });
    } else {
      navigate('/auth?mode=login', { replace: true });
    }
  };

  const handleSubmit = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/home', { replace: true });
      } else {
        await signUp(email, password);
        setError('Registration successful! Please check your email for confirmation.');
        setTimeout(() => {
          navigate('/auth?mode=login', { replace: true });
        }, 2000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err instanceof Error) {
        // Handle specific error messages
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else if (err.message.includes('confirmation link')) {
          setError('Please check your email for a confirmation link');
        } else {
          setError(err.message);
        }
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <motion.div 
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={handleModeChange}
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>

        <motion.div
          key={mode} 
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {isLogin ? (
            <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
          ) : (
            <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthForm;