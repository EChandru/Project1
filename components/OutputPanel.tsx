import React from 'react';

interface OutputPanelProps {
  dietOutput: string;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg font-semibold text-indigo-400">Generating your plan...</p>
        <p className="text-slate-400">The AI is crafting a personalized plan. This may take a moment.</p>
    </div>
);

export const OutputPanel: React.FC<OutputPanelProps> = ({ dietOutput, isLoading }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 min-h-[400px] lg:min-h-full flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4 pb-3 border-b border-slate-700 flex-shrink-0">Generated Diet Plan</h2>
      <div className="w-full h-full overflow-y-auto flex-grow mt-4 prose-lg max-w-none">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: dietOutput }}
          />
        )}
      </div>
    </div>
  );
};