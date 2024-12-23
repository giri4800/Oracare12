import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, History, Settings } from 'lucide-react';

const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Welcome to <span className="text-blue-600 dark:text-blue-400">OralScan AI</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Advanced oral cancer detection powered by artificial intelligence.
          Upload your medical images for instant analysis and risk assessment.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Link
            to="/analyze"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors duration-200"
          >
            Start Analysis
            <Camera className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105">
          <div className="h-12 w-12 rounded-md bg-blue-500 text-white flex items-center justify-center mb-4">
            <Camera size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Analysis</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Upload medical images for instant AI-powered analysis and risk assessment.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105">
          <div className="h-12 w-12 rounded-md bg-green-500 text-white flex items-center justify-center mb-4">
            <History size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Track History</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Keep track of all your analyses and monitor changes over time.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:scale-105">
          <div className="h-12 w-12 rounded-md bg-purple-500 text-white flex items-center justify-center mb-4">
            <Settings size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customizable</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-300">
            Customize your experience with personalized settings and preferences.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;
