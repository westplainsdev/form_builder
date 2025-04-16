import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-theme-bg-secondary hover:bg-opacity-80 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-theme-text" />
      ) : (
        <Moon className="h-5 w-5 text-theme-text" />
      )}
    </button>
  );
};

export default ThemeToggle;