import React from 'react';

interface IssueTypeSelectorProps {
  issueTypes: string[];
  selectedIssueType: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const IssueTypeSelector: React.FC<IssueTypeSelectorProps> = ({ issueTypes, selectedIssueType, onChange }) => {
  return (
    <div className="w-full">
      <label className="block mb-3 text-sm font-medium text-gray-400 text-center">
        เลือกประเภทปัญหา
      </label>
      <div className="flex flex-wrap gap-3 justify-center">
        {issueTypes.map((type) => (
          <div key={type}>
            <input
              type="radio"
              id={`issue-${type}`}
              name="issueType"
              value={type}
              checked={selectedIssueType === type}
              onChange={onChange}
              className="hidden peer"
            />
            <label
              htmlFor={`issue-${type}`}
              className="inline-flex items-center justify-center w-full px-5 py-2 text-gray-300 bg-gray-800 border-2 border-gray-600 rounded-lg cursor-pointer peer-checked:border-cyan-500 peer-checked:text-cyan-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssueTypeSelector;
