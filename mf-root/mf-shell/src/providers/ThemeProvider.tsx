import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeStyle = 'professional' | 'tint' | 'vibrant';

interface ThemeState {
  theme: ThemeMode;
  themeStyle: ThemeStyle;
}

interface ThemeContextValue {
  currentTheme: ThemeState;
  setTheme: (theme: Partial<ThemeState>) => void;
}

const defaultTheme: ThemeState = {
  theme: 'system',
  themeStyle: 'professional',
};

const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: defaultTheme,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeState>(() => {
    // Check if a theme preference is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? { ...defaultTheme, ...JSON.parse(savedTheme) } : defaultTheme;
  });

  // Update the theme in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(currentTheme));
    
    // Apply theme classes to the document element
    const root = document.documentElement;
    
    // Apply dark/light mode
    if (currentTheme.theme === 'dark' || 
        (currentTheme.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply theme style
    root.setAttribute('data-theme-style', currentTheme.themeStyle);
    
  }, [currentTheme]);

  const setTheme = (theme: Partial<ThemeState>) => {
    setCurrentTheme(prevTheme => ({ ...prevTheme, ...theme }));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}