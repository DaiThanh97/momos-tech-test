import { createTheme, alpha } from "@mui/material/styles";

// Create a modern, cool theme with dark mode support
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00d4ff",
      light: "#5dffff",
      dark: "#00a3cc",
      contrastText: "#000000",
    },
    secondary: {
      main: "#ff4081",
      light: "#ff79b0",
      dark: "#c60055",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a0e27",
      paper: "#151932",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b8c5d6",
    },
    error: {
      main: "#ff5252",
    },
    warning: {
      main: "#ffc107",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0, 212, 255, 0.4)",
            transform: "translateY(-2px)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #00d4ff 30%, #0099cc 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #00a3cc 30%, #007799 90%)",
          },
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #ff4081 30%, #f50057 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #f50057 30%, #c51162 90%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha("#151932", 0.8),
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha("#00d4ff", 0.1)}`,
          borderRadius: 16,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 40px ${alpha("#00d4ff", 0.2)}`,
            borderColor: alpha("#00d4ff", 0.3),
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: alpha("#ffffff", 0.05),
            borderRadius: 8,
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: alpha("#00d4ff", 0.2),
            },
            "&:hover fieldset": {
              borderColor: alpha("#00d4ff", 0.4),
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00d4ff",
              boxShadow: `0 0 0 4px ${alpha("#00d4ff", 0.1)}`,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#151932", 0.8),
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha("#00d4ff", 0.1)}`,
          boxShadow: `0 4px 20px ${alpha("#000000", 0.5)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

// Light theme alternative (if needed)
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
      light: "#e33371",
      dark: "#9a0036",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
      },
    },
  },
});
