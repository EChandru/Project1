import React from 'react';

interface CustomInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-400 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-slate-200 placeholder-slate-500"
      />
    </div>
  );
};