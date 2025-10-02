import React, { useState, useEffect, useCallback } from 'react';
import { DEPARTMENTS, ISSUE_TYPES } from './constants';
import DepartmentSelector from './components/DepartmentSelector';
import IssueTypeSelector from './components/IssueTypeSelector';
import Counter from './components/Counter';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

interface IssueData {
  [year: string]: {
    [month: string]: {
      [department: string]: {
        [issueType: string]: number;
      };
    };
  };
}

const App: React.FC = () => {
  const [data, setData] = useState<IssueData>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string>(DEPARTMENTS[0]);
  const [selectedIssueType, setSelectedIssueType] = useState<string>(ISSUE_TYPES[0]);
  const [currentView, setCurrentView] = useState<'counter' | 'dashboard'>('counter');

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedDataRaw = localStorage.getItem('issueTrackerData');
      if (savedDataRaw) {
        setData(JSON.parse(savedDataRaw));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      if (Object.keys(data).length > 0) {
        localStorage.setItem('issueTrackerData', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [data]);

  const handleDepartmentChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  }, []);

  const handleIssueTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIssueType(event.target.value);
  }, []);

  const handleIncrement = useCallback(() => {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();

    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy
      
      const yearData = newData[year] || {};
      const monthData = yearData[month] || {};
      const departmentData = monthData[selectedDepartment] || {};
      const currentCount = departmentData[selectedIssueType] || 0;
      
      departmentData[selectedIssueType] = currentCount + 1;
      monthData[selectedDepartment] = departmentData;
      yearData[month] = monthData;
      newData[year] = yearData;

      return newData;
    });
  }, [selectedDepartment, selectedIssueType]);

  const handleReset = useCallback(() => {
    if (window.confirm(`คุณต้องการรีเซ็ตจำนวนของ "${selectedDepartment} (${selectedIssueType})"?`)) {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();

      setData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        
        if (newData[year]?.[month]?.[selectedDepartment]) {
            newData[year][month][selectedDepartment][selectedIssueType] = 0;
        }

        return newData;
      });
    }
  }, [selectedDepartment, selectedIssueType]);
  
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString();

  const currentCount = data[year]?.[month]?.[selectedDepartment]?.[selectedIssueType] || 0;
  const dataForCurrentMonth = data[year]?.[month] || {};

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        
        {currentView === 'counter' && (
          <div className="w-full max-w-lg flex flex-col items-center space-y-8">
            <DepartmentSelector
              departments={DEPARTMENTS}
              selectedDepartment={selectedDepartment}
              onChange={handleDepartmentChange}
            />
            <IssueTypeSelector
              issueTypes={ISSUE_TYPES}
              selectedIssueType={selectedIssueType}
              onChange={handleIssueTypeChange}
            />
            <Counter
              departmentName={selectedDepartment}
              issueTypeName={selectedIssueType}
              count={currentCount}
              onIncrement={handleIncrement}
              onReset={handleReset}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard 
            dataForMonth={dataForCurrentMonth}
            departments={DEPARTMENTS}
            issueTypes={ISSUE_TYPES}
          />
        )}
      </div>
    </div>
  );
};

export default App;
