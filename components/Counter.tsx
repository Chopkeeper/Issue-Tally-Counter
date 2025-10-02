import React from 'react';

interface CounterProps {
  departmentName: string;
  issueTypeName: string;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
}

const Counter: React.FC<CounterProps> = ({ departmentName, issueTypeName, count, onIncrement, onReset }) => {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 md:p-8 w-full flex flex-col items-center space-y-6 shadow-2xl shadow-cyan-500/10">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-300">{departmentName}</h2>
        <p className="text-lg text-cyan-400">{issueTypeName}</p>
      </div>
      
      <div className="text-8xl md:text-9xl font-mono font-bold text-cyan-400" style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.4)' }}>
        {count}
      </div>

      <div className="flex flex-col items-center space-y-4 w-full pt-4">
        <button
          onClick={onIncrement}
          className="w-full max-w-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-6 md:py-8 px-8 rounded-full text-3xl md:text-4xl transition-all duration-200 ease-in-out transform active:scale-95 shadow-lg shadow-cyan-500/30"
          aria-label={`นับเพิ่มสำหรับ ${departmentName} ประเภท ${issueTypeName}`}
        >
          นับเพิ่ม
        </button>
        <button
          onClick={onReset}
          className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          รีเซ็ต
        </button>
      </div>
    </div>
  );
};

export default Counter;
