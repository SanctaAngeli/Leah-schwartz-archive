import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'night';

interface ThemeContextType {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
  isNight: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      if (saved === 'night' || saved === 'light') {
        return saved;
      }
    }
    return 'light';
  });

  const toggle = useCallback(() => {
    setMode(prev => prev === 'light' ? 'night' : 'light');
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;

    if (mode === 'night') {
      root.classList.add('night-mode');
      root.style.setProperty('--bg-gallery', '#1a1a1a');
      root.style.setProperty('--bg-glass', 'rgba(30, 30, 30, 0.8)');
      root.style.setProperty('--text-primary', '#f5f5f5');
      root.style.setProperty('--text-secondary', '#a0a0a0');
      root.style.setProperty('--text-muted', '#666666');
    } else {
      root.classList.remove('night-mode');
      root.style.setProperty('--bg-gallery', '#FAFAFA');
      root.style.setProperty('--bg-glass', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--text-primary', '#1A1A1A');
      root.style.setProperty('--text-secondary', '#4A4A4A');
      root.style.setProperty('--text-muted', '#8A8A8A');
    }

    // Save preference
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle, setMode, isNight: mode === 'night' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
