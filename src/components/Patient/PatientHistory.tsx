import React from 'react';
import { Link } from 'react-router-dom';
import { usePatientStore } from '../../stores/usePatientStore';
import { motion } from 'framer-motion';

type PatientSummary = {
  id: string;
  patient_id: string;
  category: string;
  riskFactors: string;
  symptoms: string;
  medicalHistory: string;
};

export const PatientHistory = () => {
  const { patients } = usePatientStore();

  const getPatientSummary = (patient: any): PatientSummary => {
    const riskFactors = [];
    if (patient.tobacco === 'Yes') riskFactors.push('Tobacco use');
    if (patient.smoking === 'Yes') riskFactors.push('Smoking');
    if (patient.pan_masala === 'Yes') riskFactors.push('Pan masala use');
    if (patient.family_history === 'Yes') riskFactors.push('Family history');
    if (patient.poor_dental_hygiene === 'Yes') riskFactors.push('Poor dental hygiene');
    if (patient.immune_compromised === 'Yes') riskFactors.push('Immune compromised');

    const symptoms = [];
    if (patient.persistent_sore_throat === 'Yes') symptoms.push('Persistent sore throat');
    if (patient.difficulty_swallowing === 'Yes') symptoms.push('Difficulty swallowing');
    if (patient.weight_loss === 'Yes') symptoms.push('Weight loss');
    if (patient.voice_changes === 'Yes') symptoms.push('Voice changes');
    if (patient.lumps_in_neck === 'Yes') symptoms.push('Lumps in neck');
    if (patient.frequent_mouth_sores === 'Yes') symptoms.push('Frequent mouth sores');
    if (patient.poor_dental_hygiene === 'Yes') symptoms.push('Poor dental hygiene');
    if (patient.pain_level && patient.pain_level !== 'None') {
      symptoms.push(`Pain Level: ${patient.pain_level}`);
    }
    if (patient.symptom_duration) {
      symptoms.push(`Duration: ${patient.symptom_duration} months`);
    }

    const medicalHistory = [];
    if (patient.family_history === 'Yes') medicalHistory.push('Family history of oral cancer');
    if (patient.immune_compromised === 'Yes') medicalHistory.push('Immune system compromised');

    return {
      id: patient.id,
      patient_id: patient.patient_id,
      category: getRiskCategory(riskFactors.length, symptoms.length),
      riskFactors: riskFactors.length > 0 ? riskFactors.join(', ') : 'None',
      symptoms: symptoms.length > 0 ? symptoms.join(', ') : 'None',
      medicalHistory: medicalHistory.length > 0 ? medicalHistory.join(', ') : 'None'
    };
  };

  const getRiskCategory = (riskCount: number, symptomCount: number): string => {
    if (riskCount >= 2 && symptomCount >= 2) return 'High Risk';
    if (riskCount >= 1 || symptomCount >= 1) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Patient History
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            View and manage all patient records
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Patient ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Risk Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Risk Factors</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Symptoms</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Medical History</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => {
                  const summary = getPatientSummary(patient);
                  return (
                    <tr key={patient.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{summary.patient_id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${summary.category === 'High Risk' ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300' :
                            summary.category === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300'}`}>
                          {summary.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{summary.riskFactors}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{summary.symptoms}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{summary.medicalHistory}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientHistory;
