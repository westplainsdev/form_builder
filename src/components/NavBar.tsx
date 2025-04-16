import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  onNewForm?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onNewForm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav
      className="backdrop-blur-md bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 shadow-lg px-6 py-3 flex items-center justify-between sticky top-0 left-0 right-0 z-30 transition-all"
      style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
    >
      {/* Left: App icon and title */}
      <div className="flex items-center gap-3 select-none">
        <span className="text-3xl drop-shadow-sm">📝</span>
        <span className="font-extrabold text-2xl tracking-wide text-gray-800 dark:text-gray-100">Form Builder</span>
      </div>
      {/* Center: Navigation links */}
      <div className="flex gap-3 md:gap-6">
        <Link
          to="/"
          className={`relative px-4 py-1 rounded-full font-semibold transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 hover:scale-105 ${
            location.pathname === '/'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow-sm'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Form List
        </Link>
        <button
          type="button"
          onClick={() => {
            if (onNewForm) onNewForm();
            navigate('/builder');
          }}
          className={`relative px-4 py-1 rounded-full font-semibold transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 hover:scale-105 ${
            location.pathname === '/builder'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 shadow-sm'
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Form Builder
        </button>
      </div>
      {/* Right: Theme toggle */}
      <div className="ml-4">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
