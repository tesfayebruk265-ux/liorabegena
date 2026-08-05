import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const updateProfile = auth?.updateProfile;

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // 1. Check localStorage first
    const saved = localStorage.getItem('ab_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // 2. Check user profile
    if (currentUser?.theme === 'dark' || currentUser?.theme === 'light') {
      return currentUser.theme;
    }
    // 3. Fallback default
    return 'light';
  });

  // Sync theme to DOM & localStorage whenever theme state changes
  useEffect(() => {
    localStorage.setItem('ab_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Sync when user logs in or profile changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.theme && (currentUser.theme === 'dark' || currentUser.theme === 'light')) {
        if (currentUser.theme !== theme) {
          setThemeState(currentUser.theme);
        }
      } else {
        // If user has no theme stored in profile, persist current active theme to profile
        if (updateProfile) {
          updateProfile({ theme });
        }
      }
    }
  }, [currentUser?.id, currentUser?.theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('ab_theme', mode);
    if (currentUser && updateProfile) {
      updateProfile({ theme: mode });
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
