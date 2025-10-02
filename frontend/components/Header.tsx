
import React from 'react';

interface HeaderProps {
  currentView: 'counter' | 'dashboard';
  onViewChange: (view: 'counter' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const baseButtonClass = "px-4 py-2 rounded-md text-sm font-medium transition-colors w-full";
  const activeButtonClass = "bg-cyan-600 text-white";
  const inactiveButtonClass = "text-gray-300 hover:bg-gray-700";

  return (
    <header className="text-center w-full max-w-lg mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-cyan-400">
        Issue Tally Counter
      </h1>
      <p className="text-gray-400 mt-1 mb-6">
        แอปพลิเคชันนับจำนวนปัญหา
      </p>
      <nav className="flex justify-center bg-gray-800 p-1 rounded-lg space-x-2">
        <button
          onClick={() => onViewChange('counter')}
          className={`${baseButtonClass} ${currentView === 'counter' ? activeButtonClass : inactiveButtonClass}`}
          aria-current={currentView === 'counter' ? 'page' : undefined}
        >
          หน้าหลัก
        </button>
        <button
          onClick={() => onViewChange('dashboard')}
          className={`${baseButtonClass} ${currentView === 'dashboard' ? activeButtonClass : inactiveButtonClass}`}
          aria-current={currentView === 'dashboard' ? 'page' : undefined}
        >
          แดชบอร์ด
        </button>
      </nav>
    </header>
  );
};

export default Header;