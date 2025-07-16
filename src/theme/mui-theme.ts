import { createTheme } from '@mui/material/styles';

// 暗色主题 - 护眼设计，增强渐变效果
export const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // 柔和蓝色
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    secondary: {
      main: '#a1a1aa', // 柔和灰色
      light: '#d4d4d8',
      dark: '#71717a',
    },
    background: {
      default: '#0a0f1c', // 更深的背景色
      paper: '#111827',   // 更深的卡片背景
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
    divider: '#334155',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#111827',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.5)',
          border: '1px solid #1f2937',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgb(0 0 0 / 0.4)',
            borderColor: '#374151',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '12px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          boxShadow: '0 4px 14px 0 rgb(96 165 250 / 30%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            transform: 'translateY(-1px)',
            boxShadow: '0 8px 25px 0 rgb(96 165 250 / 40%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
          color: '#0f172a',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: '#e2e8f0',
        },
        h2: {
          color: '#cbd5e1',
        },
        h3: {
          color: '#9ca3af',
        },
      },
    },


  },
});

export const muiTheme = muiDarkTheme; 