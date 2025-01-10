import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { usePatientStore } from '../../stores/usePatientStore';
import type { Patient } from '../../stores/usePatientStore';

const PatientList = () => {
  const navigate = useNavigate();
  const { patients, deletePatient } = usePatientStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  const handleDelete = async (patientId: string) => {
    try {
      await deletePatient(patientId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {patients.map((patient) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative"
          >
            {showDeleteConfirm === patient.id && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <p className="text-gray-800 dark:text-gray-200 mb-4">Are you sure you want to delete this patient?</p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{patient.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {patient.patient_id}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(patient.id)}
                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(patient.id)}
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Age:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{patient.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gender:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{patient.gender}</span>
              </div>
              
              {/* Risk Factors */}
              {(patient.tobacco === 'Yes' || patient.smoking === 'Yes' || patient.pan_masala === 'Yes') && (
                <div className="mt-4">
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <AlertCircle size={16} className="mr-1" />
                    <span className="text-sm font-medium">Risk Factors:</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {patient.tobacco === 'Yes' && (
                      <span className="inline-block text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-1 rounded mr-1">
                        Tobacco
                      </span>
                    )}
                    {patient.smoking === 'Yes' && (
                      <span className="inline-block text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-1 rounded mr-1">
                        Smoking
                      </span>
                    )}
                    {patient.pan_masala === 'Yes' && (
                      <span className="inline-block text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-1 rounded">
                        Pan Masala
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PatientList;
