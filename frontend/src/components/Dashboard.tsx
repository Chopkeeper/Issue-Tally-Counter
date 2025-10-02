import React from 'react';
import * as XLSX from 'xlsx';

interface DashboardProps {
  dataForMonth: Record<string, Record<string, number>>;
  departments: string[];
  issueTypes: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ dataForMonth, departments, issueTypes }) => {
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const date = new Date();
  const currentMonthName = monthNames[date.getMonth()];
  const currentYear = date.getFullYear() + 543; // Buddhist year

  // This calculation is now done inside the component render logic
  // to ensure it's always up-to-date with the rendered data.

  const departmentsWithData = departments.filter(dept => {
    const deptData = dataForMonth[dept] || {};
    return issueTypes.some(type => (deptData[type] || 0) > 0);
  });

  const handleExportToExcel = () => {
    // Recalculate totals to ensure data integrity for export
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
    XLSX.utils.book_append_sheet(wb, ws, `ข้อมูลเดือน${currentMonthName}`);

    const fileName = `สรุปปัญหา_${currentMonthName}_${currentYear}.xlsx`;
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

  // FIX: Convert `count` to `number` to resolve TypeScript error.
  // `Object.values` on an object with an index signature may return `unknown[]`,
  // which causes an error when using arithmetic operators. `Number()` ensures type safety.
  displayTotals.grandTotal = Object.values(displayTotals.byIssue).reduce((sum, count) => sum + Number(count), 0);


  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/50 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cyan-400">
          แดชบอร์ดประจำเดือน {currentMonthName} {currentYear}
        </h2>
        <button
          onClick={handleExportToExcel}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
          aria-label="Export data to Excel"
          disabled={departmentsWithData.length === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export to Excel</span>
        </button>
      </div>
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
          <p className="text-center text-gray-400 py-8">ยังไม่มีข้อมูลสำหรับเดือนนี้</p>
        )}
    </div>
  );
};

export default Dashboard;
