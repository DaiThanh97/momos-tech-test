import { memo } from "react";
import { Box, CircularProgress } from "@mui/material";

interface LoadingStateProps {
  size?: number;
  py?: number;
}

const LoadingState = ({ size = 40, py = 8 }: LoadingStateProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py }}>
      <CircularProgress size={size} />
    </Box>
  );
};

export default memo(LoadingState);
