import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../stores/usePatientStore';
import { motion } from 'framer-motion';
import PatientEditForm from './PatientEditForm';

export const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, getPatientById } = usePatientStore();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(patients.find(p => p.id === id));

  useEffect(() => {
    const loadPatient = async () => {
      if (id) {
        const patientData = await getPatientById(id);
        if (patientData) {
          setPatient(patientData);
        }
        setLoading(false);
      }
    };
    loadPatient();
  }, [id, getPatientById]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading patient details...
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Patient not found
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Patient Details
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Patient ID: #{patient.patient_id}
            </p>
          </div>

          <PatientEditForm patient={patient} onCancel={handleCancel} />
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDetail;
