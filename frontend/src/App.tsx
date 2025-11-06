import React, { useState, useEffect, useCallback } from 'react';
import { DEPARTMENTS, ISSUE_TYPES } from './constants';
import DepartmentSelector from './components/DepartmentSelector';
import IssueTypeSelector from './components/IssueTypeSelector';
import Counter from './components/Counter';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

// Define the structure for the data we expect from the backend
interface MonthlyData {
  [department: string]: {
    [issueType: string]: number;
  };
}

const API_BASE_URL = '/api';

const App: React.FC = () => {
  const [data, setData] = useState<MonthlyData>({});
  const [selectedDepartment, setSelectedDepartment] = useState<string>(DEPARTMENTS[0]);
  const [selectedIssueType, setSelectedIssueType] = useState<string>(ISSUE_TYPES[0]);
  const [currentView, setCurrentView] = useState<'counter' | 'dashboard'>('counter');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for dashboard date selection
  const [dashboardYear, setDashboardYear] = useState<number>(new Date().getFullYear());
  const [dashboardMonth, setDashboardMonth] = useState<number>(new Date().getMonth() + 1);

  const fetchData = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/data/${year}/${month}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (err) {
      setData({}); // Clear data on error to prevent showing stale data
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่');
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to fetch data based on the current view and selected date for the dashboard
  useEffect(() => {
    if (currentView === 'counter') {
      const today = new Date();
      fetchData(today.getFullYear(), today.getMonth() + 1);
    } else if (currentView === 'dashboard') {
      fetchData(dashboardYear, dashboardMonth);
    }
  }, [currentView, dashboardYear, dashboardMonth, fetchData]);

  const handleDepartmentChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(event.target.value);
  }, []);

  const handleIssueTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIssueType(event.target.value);
  }, []);

  const handleIncrement = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/increment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: selectedDepartment,
          issueType: selectedIssueType,
        }),
      });
      if (!response.ok) throw new Error('Failed to increment');
      const updatedData = await response.json();
      // Since increment only happens on the counter view, which shows current month's data,
      // we can safely update the state with the response from the server.
      setData(updatedData);
    } catch (error) {
      console.error("Failed to increment count:", error);
      setError('เกิดข้อผิดพลาดในการนับเพิ่ม');
    }
  }, [selectedDepartment, selectedIssueType]);

  const handleReset = useCallback(async () => {
    if (window.confirm(`คุณต้องการรีเซ็ตจำนวนของ "${selectedDepartment} (${selectedIssueType})"?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            department: selectedDepartment,
            issueType: selectedIssueType,
          }),
        });
        if (!response.ok) throw new Error('Failed to reset');
        const updatedData = await response.json();
        // Same logic as increment, the API returns updated data for the current month.
        setData(updatedData);
      } catch (error) {
        console.error("Failed to reset count:", error);
        setError('เกิดข้อผิดพลาดในการรีเซ็ต');
      }
    }
  }, [selectedDepartment, selectedIssueType]);

  const currentCount = data[selectedDepartment]?.[selectedIssueType] || 0;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg w-full max-w-lg text-center">{error}</div>}

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
           isLoading ? <p className="text-gray-400">Loading dashboard...</p> : 
          <Dashboard 
            dataForMonth={data}
            departments={DEPARTMENTS}
            issueTypes={ISSUE_TYPES}
            selectedYear={dashboardYear}
            selectedMonth={dashboardMonth}
            onYearChange={setDashboardYear}
            onMonthChange={setDashboardMonth}
          />
        )}
      </div>
    </div>
  );
};

export default App;
