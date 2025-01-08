import React from 'react';
import { useParams } from 'react-router-dom';
import { usePatientStore } from '../../stores/usePatientStore';
import { motion } from 'framer-motion';

export const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { patients } = usePatientStore();
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Patient not found
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderRiskFactors = (patient: any) => {
    const riskFactors = [];
    if (patient.tobacco === 'Yes') {
      riskFactors.push('Tobacco Use');
    }
    if (patient.smoking === 'Yes') {
      riskFactors.push('Smoking');
    }
    if (patient.pan_masala === 'Yes') {
      riskFactors.push('Pan Masala Use');
    }
    return riskFactors;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Patient Details
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Patient ID: #{patient.patient_id}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-900 dark:text-white">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{patient.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900 dark:text-white">Age</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{patient.age}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-900 dark:text-white">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{patient.gender}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Risk Factors</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderRiskFactors(patient).map((factor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-sm text-gray-900 dark:text-white">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Symptoms</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(patient)
                  .filter(([key, value]) => value === 'Yes' && key.includes('_'))
                  .map(([key]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDetail;
