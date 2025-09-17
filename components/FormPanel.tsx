import React from 'react';
import { PatientData } from '../types';
import { GENDER_OPTIONS, PRAKRITI_OPTIONS, VIKRITI_OPTIONS, DIGESTION_OPTIONS } from '../constants';
import { CustomInput } from './CustomInput';
import { CustomSelect } from './CustomSelect';
import { IconSparkles } from './Icons';

interface FormPanelProps {
  patientData: PatientData;
  setPatientData: React.Dispatch<React.SetStateAction<PatientData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const FormPanel: React.FC<FormPanelProps> = ({ patientData, setPatientData, onGenerate, isLoading }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-indigo-400 mb-6 pb-3 border-b border-slate-700">Patient Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div className="md:col-span-2">
            <CustomInput label="Patient Full Name" name="patientName" value={patientData.patientName} onChange={handleChange} required />
        </div>
        <CustomInput label="Age" name="age" type="number" value={patientData.age} onChange={handleChange} required />
        <CustomSelect label="Gender" name="gender" value={patientData.gender} onChange={handleChange} options={GENDER_OPTIONS} />
        <CustomSelect label="Prakriti (Constitution)" name="prakriti" value={patientData.prakriti} onChange={handleChange} options={PRAKRITI_OPTIONS} required />
        <CustomSelect label="Vikriti (Current Imbalance)" name="vikriti" value={patientData.vikriti} onChange={handleChange} options={VIKRITI_OPTIONS} />
        <div className="md:col-span-2">
            <CustomSelect label="Digestive Strength" name="digestion" value={patientData.digestion} onChange={handleChange} options={DIGESTION_OPTIONS} />
        </div>
        <div className="md:col-span-2">
            <CustomInput label="Allergies (comma-separated)" name="allergies" value={patientData.allergies} onChange={handleChange} placeholder="e.g., Peanuts, Gluten" />
        </div>
        <div className="md:col-span-2">
            <CustomInput label="Health Goals" name="healthGoals" value={patientData.healthGoals} onChange={handleChange} placeholder="e.g., Improve digestion, Reduce stress" />
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <IconSparkles className="w-5 h-5" />
          {isLoading ? 'Generating...' : 'Generate Diet Plan'}
        </button>
      </div>
    </div>
  );
};