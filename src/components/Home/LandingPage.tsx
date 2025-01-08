import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { color } from 'framer-motion';

const ProductCard = ({ 
  title, 
  description, 
  status, 
  onClick, 
  isComingSoon,
  actionText 
}: { 
  title: string; 
  description: string; 
  status: string;
  onClick: () => void;
  isComingSoon: boolean;
  actionText: string;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <button
        onClick={onClick}
        disabled={isComingSoon}
        className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
          isComingSoon
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
            : 'bg-medical-primary-600 text-white hover:bg-medical-primary-700 dark:bg-medical-primary-500 dark:hover:bg-medical-primary-600'
        }`}
      >
        {actionText}
      </button>
    </div>
  </div>
);

export const OldLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const products = [
    {
      title: 'OraCare',
      description: 'Advanced oral health screening platform. Empowering healthcare professionals with quick, accurate assessments and comprehensive patient history tracking for early detection and prevention.',
      status: 'Active',
      isComingSoon: false,
      actionText: 'Get Started',
      onClick: () => {
        if (user) {
          navigate('/home');
        } else {
          navigate('/project');
        }
      }
    },
    {
      title: 'O.D.D',
      description: 'Oven Dyvrtgv Detection - A comprehensive diagnostic tool leveraging modern technology for early detection of various oral diseases and conditions. Enhanced diagnostic capabilities coming soon.',
      status: 'Coming Soon',
      isComingSoon: true,
      actionText: 'Coming Soon',
      onClick: () => {}
    },
    {
      title: 'P.A.G.E.S',
      description: 'Patient Analysis and Genaral Evaluation System - An innovative platform integrating patient data with genomic analysis for personalized treatment approaches in oral healthcare.ashjdfbvchsdfbcvhj.',
      status: 'Coming Soon',
      isComingSoon: true,
      actionText: 'Coming Soon',
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-medical-primary-50 dark:from-gray-900 dark:to-medical-primary-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-medical-primary-600 to-medical-accent-teal bg-clip-text text-transparent">
              Hope
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" style={{color:'lightgreen', fontWeight: 'bold', fontSize: '26px'}}>
          <i>THERE IS ALWAYS :</i><br/>
             <p style={{color:'green', fontWeight: 'bold',marginTop: '10px',textDecoration: 'underline',fontSize: '26px'}}>H.O.P.E.</p>
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard
              key={product.title}
              title={product.title}
              description={product.description}
              status={product.status}
              onClick={product.onClick}
              isComingSoon={product.isComingSoon}
              actionText={product.actionText}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().getFullYear()} Hope Organization. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
