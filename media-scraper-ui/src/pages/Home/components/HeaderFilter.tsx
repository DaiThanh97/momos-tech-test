import { memo, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  InputAdornment,
  alpha,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { MediaTypeFilter } from "../../../types";
import SearchIcon from "@mui/icons-material/Search";
import { useAppDispatch, useAppSelector } from "../../../store";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import GridViewIcon from "@mui/icons-material/GridView";
import {
  clearMedia,
  setFilter,
  setSearchText,
} from "../../../store/slices/mediaSlice";
import {
  getGlassmorphismCard,
  getGradientText,
  getGradientBackground,
  getGradientBackgroundHover,
} from "../../../utils/styles";

interface HeaderFilterProps {
  fetchMedia: (page: number) => void;
  setCurrentPage: (page: number) => void;
}

const HeaderFilter = ({ fetchMedia, setCurrentPage }: HeaderFilterProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { currentFilter, searchText } = useAppSelector((state) => state.media);
  const { loadingMedia } = useAppSelector((state) => state.loading);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1);
      dispatch(clearMedia());
      fetchMedia(1);
    },
    [dispatch, fetchMedia, setCurrentPage]
  );

  const handleFilterChange = useCallback(
    (
      _event: React.MouseEvent<HTMLElement>,
      newFilter: MediaTypeFilter | null
    ) => {
      if (newFilter !== null && newFilter !== currentFilter) {
        dispatch(setFilter(newFilter));
        setCurrentPage(1);
      }
    },
    [currentFilter, dispatch, setCurrentPage]
  );

  const handleSearchTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchText(e.target.value));
    },
    [dispatch]
  );

  const getFilterIcon = useCallback((filter: MediaTypeFilter) => {
    switch (filter) {
      case MediaTypeFilter.IMAGE:
        return <ImageIcon />;
      case MediaTypeFilter.VIDEO:
        return <VideoLibraryIcon />;
      default:
        return <GridViewIcon />;
    }
  }, []);

  const filterButtons = useMemo(
    () => [
      { value: MediaTypeFilter.ALL, label: "All" },
      { value: MediaTypeFilter.IMAGE, label: "Images" },
      { value: MediaTypeFilter.VIDEO, label: "Videos" },
    ],
    []
  );

  return (
    <Box sx={{ mb: 4, p: 3, ...getGlassmorphismCard(theme) }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, ...getGradientText(theme) }}
      >
        Media Gallery
      </Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            placeholder="Search by URL or page title..."
            value={searchText}
            onChange={handleSearchTextChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: alpha(theme.palette.background.default, 0.5),
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            disabled={loadingMedia}
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              ...getGradientBackground(theme),
              "&:hover": getGradientBackgroundHover(theme),
            }}
          >
            Search
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}
        >
          Filter by:
        </Typography>
        <ToggleButtonGroup
          value={currentFilter}
          exclusive
          onChange={handleFilterChange}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&.Mui-selected": {
                ...getGradientBackground(theme),
                color: theme.palette.primary.contrastText,
                "&:hover": getGradientBackgroundHover(theme),
              },
            },
          }}
        >
          {filterButtons.map((button) => (
            <ToggleButton key={button.value} value={button.value}>
              {getFilterIcon(button.value)}
              <Box component="span" sx={{ ml: 1 }}>
                {button.label}
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default memo(HeaderFilter);
