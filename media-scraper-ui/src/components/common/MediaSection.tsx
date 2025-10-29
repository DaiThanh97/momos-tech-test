import { memo, ReactNode } from "react";
import { Box, Typography, useTheme } from "@mui/material";

interface MediaSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const MediaSection = ({ title, icon, children }: MediaSectionProps) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon} {title}
      </Typography>
      {children}
    </Box>
  );
};

export default memo(MediaSection);
