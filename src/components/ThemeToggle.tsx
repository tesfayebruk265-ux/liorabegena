import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'pill' | 'compact' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'pill', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center p-1 bg-gray-200 dark:bg-neutral-800 rounded-full border border-gray-300 dark:border-neutral-700 shadow-inner ${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            !isDark
              ? 'bg-white text-amber-900 shadow-sm'
              : 'text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sun size={14} className={!isDark ? 'text-amber-500 fill-amber-500' : ''} />
          <span>Light Mode</span>
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            isDark
              ? 'bg-neutral-900 text-amber-400 shadow-sm border border-neutral-700'
              : 'text-gray-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Moon size={14} className={isDark ? 'text-amber-400 fill-amber-400' : ''} />
          <span>Dark Mode</span>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle light and dark mode"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
          isDark
            ? 'bg-neutral-800/90 text-amber-400 border-neutral-700 hover:bg-neutral-700'
            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
        } ${className}`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Moon size={16} className="fill-amber-400 text-amber-400" /> : <Sun size={16} className="text-amber-600 fill-amber-500" />}
        </motion.div>
      </button>
    );
  }

  // Standard Pill Toggle
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme mode"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-xs ${
        isDark
          ? 'bg-neutral-900 border-neutral-700 text-amber-400 hover:border-amber-500/50'
          : 'bg-amber-50/90 border-amber-200/80 text-amber-900 hover:bg-amber-100'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-1.5"
      >
        {isDark ? (
          <>
            <Moon size={14} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun size={14} className="fill-amber-500 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">Light Mode</span>
          </>
        )}
      </motion.div>
    </button>
  );
}
