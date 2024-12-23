import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>
        
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;