

import React from 'react';

interface DepartmentSelectorProps {
  departments: string[];
  selectedDepartment: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ departments, selectedDepartment, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="department-select" className="block mb-2 text-sm font-medium text-gray-400">
        เลือกหน่วยงาน
      </label>
      <select
        id="department-select"
        value={selectedDepartment}
        onChange={onChange}
        className="bg-gray-800 border border-gray-600 text-white text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-3"
      >
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DepartmentSelector;