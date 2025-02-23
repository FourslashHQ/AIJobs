import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light'
});

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Space Grotesk Variable", "Space Grotesk", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          h1: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '3rem',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
          },
          h2: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '2.25rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
          },
          h3: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '1.875rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          },
          h4: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '1.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.4,
          },
          h5: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.4,
          },
          h6: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.4,
          },
          body1: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 300,
            fontSize: '1rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
          },
          body2: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 300,
            fontSize: '0.875rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
          },
          button: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 500,
            fontSize: '0.875rem',
            letterSpacing: '-0.01em',
            textTransform: 'none',
          },
          caption: {
            fontFamily: '"JetBrains Mono Variable", "JetBrains Mono", monospace',
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0',
            lineHeight: 1.5,
          },
          overline: {
            fontFamily: '"JetBrains Mono Variable", "JetBrains Mono", monospace',
            fontWeight: 400,
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            lineHeight: 1.5,
            textTransform: 'uppercase',
          },
          subtitle1: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 300,
            fontSize: '1rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
          },
          subtitle2: {
            fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
            fontWeight: 300,
            fontSize: '0.875rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
          },
        },
        palette: {
          mode: 'dark',
          primary: {
            main: '#c1ff72',
            light: '#d4ff9a',
            dark: '#9ecc5c',
            contrastText: '#000000',
          },
          background: {
            default: '#000000',
            paper: '#111111',
          },
          text: {
            primary: '#ffffff',
            secondary: '#c1ff72',
          },
          custom: {
            brandGreen: '#c1ff72',
            white: '#ffffff',
            black: '#000000',
          }
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: 8,
              },
              containedPrimary: {
                backgroundColor: '#c1ff72',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#9ecc5c',
                },
              },
              outlinedPrimary: {
                borderColor: '#c1ff72',
                color: '#c1ff72',
                '&:hover': {
                  borderColor: '#9ecc5c',
                  backgroundColor: 'rgba(193, 255, 114, 0.1)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(193, 255, 114, 0.1)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                backgroundColor: '#c1ff72',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#9ecc5c',
                },
              },
              label: {
                color: '#000000',
              },
            },
          },
        },
      }),
    []
  );

  return (
    <ColorModeContext.Provider value={{ mode: 'dark', toggleColorMode: () => {} }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};
