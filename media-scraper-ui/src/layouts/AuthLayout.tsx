import { memo, ReactNode } from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  getAuthPageBackground,
  getGlassmorphismCard,
  getGradientText,
} from "../utils/styles";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  const theme = useTheme();

  return (
    <Box sx={getAuthPageBackground(theme)}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            ...getGlassmorphismCard(theme),
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                m: 2,
                width: 64,
                height: 64,
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.secondary.main,
                  0.3
                )}`,
              }}
            >
              <YouTubeIcon
                sx={{ fontSize: 40, color: theme.palette.secondary.main }}
              />
            </Avatar>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                ...getGradientText(theme),
              }}
            >
              {title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>

            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default memo(AuthLayout);
