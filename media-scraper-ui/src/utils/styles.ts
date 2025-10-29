import { alpha, Theme } from "@mui/material";

// Common gradient backgrounds
export const getGradientBackground = (theme: Theme) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
});

export const getGradientBackgroundHover = (theme: Theme) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
});

export const getSecondaryGradient = (theme: Theme) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
});

export const getSecondaryGradientHover = (theme: Theme) => ({
  background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
});

// Gradient text
export const getGradientText = (theme: Theme) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

// Glassmorphism card
export const getGlassmorphismCard = (theme: Theme) => ({
  backdropFilter: "blur(20px)",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: 3,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
});

// Page background with gradient
export const getPageBackground = (theme: Theme) => ({
  minHeight: "100vh",
  pt: 12,
  pb: 6,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.default,
    0.9
  )} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
});

// Auth page background with animation
export const getAuthPageBackground = (theme: Theme) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `radial-gradient(circle, ${alpha(
      theme.palette.primary.main,
      0.05
    )} 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
    animation: "moveBackground 20s linear infinite",
  },
  "@keyframes moveBackground": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(50px, 50px)" },
  },
});
