import { memo, useCallback } from "react";
import { Box, Pagination, Typography, alpha, useTheme } from "@mui/material";
import type { PaginationMeta } from "../../types";

interface PaginationControlsProps {
  pagination: PaginationMeta;
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls = ({
  pagination,
  currentPage,
  isLoading,
  onPageChange,
}: PaginationControlsProps) => {
  const theme = useTheme();

  const handleChangePage = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onPageChange]
  );

  if (pagination.totalPages <= 1) return null;

  const startItem = (pagination.currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(
    pagination.currentPage * pagination.perPage,
    pagination.totalItems
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 4,
        p: 3,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.4),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {startItem} - {endItem} of {pagination.totalItems} items
        </Typography>
      </Box>
      <Pagination
        count={pagination.totalPages}
        page={currentPage}
        onChange={handleChangePage}
        color="primary"
        size="large"
        disabled={isLoading}
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        sx={{
          "& .MuiPaginationItem-root": {
            color: theme.palette.text.primary,
            fontWeight: 600,
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              transform: "scale(1.1)",
            },
            "&:hover:not(.Mui-selected)": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          },
        }}
      />
      {pagination.hasNextPage && (
        <Typography variant="caption" color="text.secondary">
          {pagination.totalPages - currentPage} more{" "}
          {pagination.totalPages - currentPage === 1 ? "page" : "pages"}{" "}
          available
        </Typography>
      )}
    </Box>
  );
};

export default memo(PaginationControls);
