import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient, usePatientStore } from '../../stores/usePatientStore';

interface PatientEditFormProps {
  patient: Patient;
  onCancel: () => void;
}

const PatientEditForm: React.FC<PatientEditFormProps> = ({ patient, onCancel }) => {
  const navigate = useNavigate();
  const { updatePatient } = usePatientStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: patient.patient_id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    tobacco: patient.tobacco,
    smoking: patient.smoking,
    pan_masala: patient.pan_masala,
    symptom_duration: patient.symptom_duration,
    pain_level: patient.pain_level,
    difficulty_swallowing: patient.difficulty_swallowing,
    weight_loss: patient.weight_loss,
    family_history: patient.family_history,
    immune_compromised: patient.immune_compromised,
    persistent_sore_throat: patient.persistent_sore_throat,
    voice_changes: patient.voice_changes,
    lumps_in_neck: patient.lumps_in_neck,
    frequent_mouth_sores: patient.frequent_mouth_sores,
    poor_dental_hygiene: patient.poor_dental_hygiene,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePatient(patient.id, formData);
      setIsEditing(false);
      navigate('/history');
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    onCancel();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {!isEditing ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Information</h2>
            <div className="space-x-4">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              >
                Back
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Name: {patient.name}</p>
              <p className="text-gray-600 dark:text-gray-400">Age: {patient.age}</p>
              <p className="text-gray-600 dark:text-gray-400">Gender: {patient.gender}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Tobacco Use: {patient.tobacco}</p>
              <p className="text-gray-600 dark:text-gray-400">Smoking: {patient.smoking}</p>
              <p className="text-gray-600 dark:text-gray-400">Pan Masala Use: {patient.pan_masala}</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Patient Information</h2>
            <div className="space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient ID</label>
                <input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tobacco Use</label>
                <select
                  name="tobacco"
                  value={formData.tobacco || 'No'}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Smoking</label>
                <select
                  name="smoking"
                  value={formData.smoking || 'No'}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pan Masala Use</label>
                <select
                  name="pan_masala"
                  value={formData.pan_masala || 'No'}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms & Medical History */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Symptoms & Medical History</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Symptom Duration (months)</label>
                  <input
                    type="number"
                    name="symptom_duration"
                    value={formData.symptom_duration || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pain Level (0-10)</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    name="pain_level"
                    value={formData.pain_level || '0'}
                    onChange={handleInputChange}
                    className="mt-1 block w-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current: {formData.pain_level || '0'}</span>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="difficulty_swallowing"
                      checked={formData.difficulty_swallowing === 'Yes'}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked ? 'Yes' : 'No'
                        }
                      } as any)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Difficulty Swallowing</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="weight_loss"
                      checked={formData.weight_loss === 'Yes'}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked ? 'Yes' : 'No'
                        }
                      } as any)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Unexplained Weight Loss</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="persistent_sore_throat"
                    checked={formData.persistent_sore_throat === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Persistent Sore Throat</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="voice_changes"
                    checked={formData.voice_changes === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Voice Changes</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="lumps_in_neck"
                    checked={formData.lumps_in_neck === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Lumps in Neck</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="frequent_mouth_sores"
                    checked={formData.frequent_mouth_sores === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Frequent Mouth Sores</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="poor_dental_hygiene"
                    checked={formData.poor_dental_hygiene === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Poor Dental Hygiene</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="family_history"
                    checked={formData.family_history === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Family History of Cancer</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="immune_compromised"
                    checked={formData.immune_compromised === 'Yes'}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked ? 'Yes' : 'No'
                      }
                    } as any)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Immune Compromised</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PatientEditForm;
