import { memo } from "react";
import { Box, Chip, alpha, useTheme } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import type { PaginationMeta } from "../../types";

interface PageStatsChipsProps {
  pagination: PaginationMeta;
  imagesCount: number;
  videosCount: number;
}

const PageStatsChips = ({
  pagination,
  imagesCount,
  videosCount,
}: PageStatsChipsProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Chip
        label={`Total: ${pagination.totalItems} ${
          pagination.totalItems === 1 ? "item" : "items"
        }`}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          fontWeight: 600,
        }}
      />
      <Chip
        label={`Page ${pagination.currentPage} of ${pagination.totalPages}`}
        size="small"
        sx={{
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          color: theme.palette.text.secondary,
          fontWeight: 600,
        }}
      />
      {imagesCount > 0 && (
        <Chip
          icon={<ImageIcon />}
          label={`${imagesCount} images on this page`}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.main,
            fontWeight: 600,
          }}
        />
      )}
      {videosCount > 0 && (
        <Chip
          icon={<VideoLibraryIcon />}
          label={`${videosCount} videos on this page`}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.secondary.main, 0.1),
            color: theme.palette.secondary.main,
            fontWeight: 600,
          }}
        />
      )}
    </Box>
  );
};

export default memo(PageStatsChips);
