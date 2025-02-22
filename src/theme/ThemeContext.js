import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const theme = {
    mode,
    colors: {
      background: mode === 'dark' ? '#121212' : '#ffffff',
      surface: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
      primary: '#007FFF',
      text: mode === 'dark' ? '#ffffff' : '#000000',
      textSecondary: mode === 'dark' ? '#b3b3b3' : '#666666',
    },
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
