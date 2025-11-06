import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';

interface DashboardProps {
  departments: string[];
  issueTypes: string[];
}

interface MonthlyData {
  [department: string]: {
    [issueType: string]: number;
  };
}

const API_BASE_URL = '/api';

const Dashboard: React.FC<DashboardProps> = ({ departments, issueTypes }) => {
  const [dataForMonth, setDataForMonth] = useState<MonthlyData>({});
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const selectedMonthName = monthNames[selectedMonth - 1];
  const selectedYearBE = selectedYear + 543; // Buddhist year

  const fetchData = useCallback(async (year: number, month: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/data/${year}/${month}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      setDataForMonth(fetchedData);
    } catch (err) {
      setDataForMonth({}); // Clear data on error to prevent showing stale data
      setError('ไม่สามารถโหลดข้อมูลสำหรับเดือนที่เลือกได้');
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth, fetchData]);

  const departmentsWithData = departments.filter(dept => {
    const deptData = dataForMonth[dept] || {};
    return issueTypes.some(type => (deptData[type] || 0) > 0);
  });
  
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
    }
    return years;
  };

  const handleExportToExcel = () => {
    const exportTotals = {
      byIssue: issueTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<string, number>),
      grandTotal: 0,
    };

    const header = ['หน่วยงาน', ...issueTypes, 'รวม'];

    const dataRows = departmentsWithData.map(dept => {
      const deptData = dataForMonth[dept] || {};
      const rowTotal = issueTypes.reduce((sum, type) => {
        const count = deptData[type] || 0;
        exportTotals.byIssue[type] += count;
        return sum + count;
      }, 0);
      exportTotals.grandTotal += rowTotal;

      const rowData: (string | number)[] = [dept];
      issueTypes.forEach(type => {
        rowData.push(deptData[type] || 0);
      });
      rowData.push(rowTotal);
      return rowData;
    });

    const footerRow: (string | number)[] = ['รวมทั้งหมด'];
    issueTypes.forEach(type => {
      footerRow.push(exportTotals.byIssue[type]);
    });
    footerRow.push(exportTotals.grandTotal);

    const exportData = [header, ...dataRows, footerRow];

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `ข้อมูลเดือน${selectedMonthName}`);

    const fileName = `สรุปปัญหา_${selectedMonthName}_${selectedYearBE}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };
  
  // Calculate totals for display
  const displayTotals = {
    byIssue: issueTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {} as Record<string, number>),
    grandTotal: 0,
  };

  departmentsWithData.forEach(dept => {
    const deptData = dataForMonth[dept] || {};
    issueTypes.forEach(type => {
      const count = deptData[type] || 0;
      displayTotals.byIssue[type] += count;
    });
  });
  displayTotals.grandTotal = Object.values(displayTotals.byIssue).reduce((sum, count) => sum + count, 0);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-cyan-400">
          แดชบอร์ดประจำเดือน {selectedMonthName} {selectedYearBE}
        </h2>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            aria-label="Select month"
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index + 1}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            aria-label="Select year"
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year + 543}</option>
            ))}
          </select>
           <button
              onClick={handleExportToExcel}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed w-full md:w-auto justify-center"
              aria-label="Export data to Excel"
              disabled={departmentsWithData.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export</span>
            </button>
        </div>
      </div>
      {isLoading ? (
        <p className="text-center text-gray-400 py-8">กำลังโหลดข้อมูล...</p>
      ) : error ? (
         <p className="text-center text-red-400 py-8">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-cyan-300 uppercase bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">หน่วยงาน</th>
                  {issueTypes.map(type => (
                    <th key={type} scope="col" className="px-6 py-3 text-center">{type}</th>
                  ))}
                  <th scope="col" className="px-6 py-3 text-center rounded-tr-lg">รวม</th>
                </tr>
              </thead>
              <tbody>
                {departmentsWithData.map((dept) => {
                  const deptData = dataForMonth[dept] || {};
                  const rowTotal = issueTypes.reduce((sum, type) => sum + (deptData[type] || 0), 0);

                  return (
                    <tr key={dept} className="bg-gray-800/80 border-b border-gray-700 hover:bg-gray-700/80">
                      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">{dept}</th>
                      {issueTypes.map(type => (
                        <td key={type} className="px-6 py-4 text-center">{deptData[type] || 0}</td>
                      ))}
                      <td className="px-6 py-4 font-bold text-center">{rowTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="font-bold text-cyan-300 bg-gray-700/50">
                <tr>
                  <td className="px-6 py-3 rounded-bl-lg">รวมทั้งหมด</td>
                  {issueTypes.map(type => (
                    <td key={type} className="px-6 py-3 text-center">{displayTotals.byIssue[type]}</td>
                  ))}
                  <td className="px-6 py-3 text-center rounded-br-lg">{displayTotals.grandTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {departmentsWithData.length === 0 && (
              <p className="text-center text-gray-400 py-8">ไม่มีข้อมูลสำหรับเดือนที่เลือก</p>
            )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
