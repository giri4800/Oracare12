import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '../../stores/usePatientStore';
import Alert from '../ui/Alert';

interface FormData {
  patient_id: string;
  name: string;
  age: string;
  gender: string;
  tobacco: 'Yes' | 'No';
  smoking: 'Yes' | 'No';
  pan_masala: 'Yes' | 'No';
  symptom_duration: string;
  pain_level: string;
  difficulty_swallowing: 'Yes' | 'No';
  weight_loss: 'Yes' | 'No';
  persistent_sore_throat: 'Yes' | 'No';
  voice_changes: 'Yes' | 'No';
  lumps_in_neck: 'Yes' | 'No';
  frequent_mouth_sores: 'Yes' | 'No';
  poor_dental_hygiene: 'Yes' | 'No';
  family_history: 'Yes' | 'No';
  immune_compromised: 'Yes' | 'No';
}

const defaultFormData: FormData = {
  patient_id: '',
  name: '',
  age: '',
  gender: '',
  tobacco: 'No',
  smoking: 'No',
  pan_masala: 'No',
  symptom_duration: '',
  pain_level: '0',
  difficulty_swallowing: 'No',
  weight_loss: 'No',
  persistent_sore_throat: 'No',
  voice_changes: 'No',
  lumps_in_neck: 'No',
  frequent_mouth_sores: 'No',
  poor_dental_hygiene: 'No',
  family_history: 'No',
  immune_compromised: 'No'
};

export default function AddPatient() {
  const navigate = useNavigate();
  const { createPatient } = usePatientStore();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked ? 'Yes' : 'No'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Submitting form data:', formData);
      
      if (!formData.patient_id.trim()) {
        throw new Error('Patient ID is required');
      }
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.age) {
        throw new Error('Age is required');
      }
      
      // Add age validation
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18) {
        throw new Error('Patient must be 18 years or older');
      }
      
      if (!formData.gender) {
        throw new Error('Gender is required');
      }

      const result = await createPatient({
        ...formData,
        age: age // Use the parsed age
      });
      
      console.log('Patient created successfully:', result);
      setAlert({ 
        type: 'success', 
        message: 'Patient added successfully! You can add another patient.' 
      });
      
      // Reset form for next patient
      resetForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);

    } catch (error: any) {
      console.error('Error adding patient:', error);
      setAlert({ 
        type: 'error', 
        message: error.message || 'Failed to add patient. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {alert && (
        <motion.div 
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </motion.div>
      )}
      <motion.div 
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-8">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Add New Patient</h2>
            
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-primary-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-primary-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="18"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-primary-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-primary-500 focus:border-transparent transition-colors duration-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Risk Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries({
                  tobacco: 'Tobacco Use',
                  smoking: 'Smoking',
                  pan_masala: 'Pan Masala',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={formData[key as keyof FormData] === 'Yes'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-medical-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-medical-primary-500 dark:focus:ring-offset-gray-800"
                    />
                    <label htmlFor={key} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Symptoms & Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="symptom_duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Symptom Duration (months)
                  </label>
                  <input
                    type="number"
                    id="symptom_duration"
                    name="symptom_duration"
                    value={formData.symptom_duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-medical-primary-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="pain_level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pain Level (0-10)
                  </label>
                  <input
                    type="range"
                    id="pain_level"
                    name="pain_level"
                    min="0"
                    max="10"
                    value={formData.pain_level}
                    onChange={handleInputChange}
                    className="w-full accent-medical-primary-500"
                  />
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Current: {formData.pain_level}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries({
                  difficulty_swallowing: 'Difficulty Swallowing',
                  weight_loss: 'Unexplained Weight Loss',
                  persistent_sore_throat: 'Persistent Sore Throat',
                  voice_changes: 'Voice Changes',
                  lumps_in_neck: 'Lumps in Neck',
                  frequent_mouth_sores: 'Frequent Mouth Sores',
                  poor_dental_hygiene: 'Poor Dental Hygiene',
                  family_history: 'Family History of Oral Cancer',
                  immune_compromised: 'Immune System Compromised',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={formData[key as keyof FormData] === 'Yes'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-medical-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-medical-primary-500 dark:focus:ring-offset-gray-800"
                    />
                    <label htmlFor={key} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-semibold"
              >
                {isSubmitting ? 'Adding Patient...' : 'Add Patient'}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </form>
  );
}
