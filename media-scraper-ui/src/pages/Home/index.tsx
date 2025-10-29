import { useCallback, useEffect, useState } from "react";
import { Container, Box, Stack, useTheme } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { useAppDispatch, useAppSelector } from "../../store";
import { GET_MEDIA_SAGA } from "../../store/sagas/mediaSaga";
import { clearMedia } from "../../store/slices/mediaSlice";
import { ImageGallery, VideoGallery } from "./components/MediaGallery";
import { MediaTypeFilter } from "../../types";
import HeaderFilter from "./components/HeaderFilter";
import {
  PageStatsChips,
  PaginationControls,
  EmptyState,
  LoadingState,
  MediaSection,
} from "../../components/common";
import { useMediaFilter } from "../../hooks";
import { getPageBackground } from "../../utils/styles";

const ITEMS_PER_PAGE = 20;

const Home = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { mediaList, pagination, currentFilter, searchText } = useAppSelector(
    (state) => state.media
  );
  const { loadingMedia } = useAppSelector((state) => state.loading);
  const { images, videos } = useMediaFilter(mediaList);

  const fetchMedia = useCallback(
    (page: number = 1) => {
      dispatch(clearMedia());
      dispatch({
        type: GET_MEDIA_SAGA,
        payload: {
          page,
          limit: ITEMS_PER_PAGE,
          type: currentFilter,
          search: searchText,
        },
      });
    },
    [currentFilter, searchText]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchMedia(1);
  }, [currentFilter]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchMedia(page);
    },
    [fetchMedia]
  );

  const shouldShowImages =
    (currentFilter === MediaTypeFilter.ALL ||
      currentFilter === MediaTypeFilter.IMAGE) &&
    images.length > 0;

  const shouldShowVideos =
    (currentFilter === MediaTypeFilter.ALL ||
      currentFilter === MediaTypeFilter.VIDEO) &&
    videos.length > 0;

  return (
    <Box sx={getPageBackground(theme)}>
      <Container maxWidth="xl">
        <HeaderFilter fetchMedia={fetchMedia} setCurrentPage={setCurrentPage} />

        {pagination && !loadingMedia && (
          <PageStatsChips
            pagination={pagination}
            imagesCount={images.length}
            videosCount={videos.length}
          />
        )}

        {loadingMedia && <LoadingState />}

        {!loadingMedia && mediaList.length > 0 && (
          <Stack spacing={4}>
            {shouldShowImages && (
              <MediaSection title="Images" icon={<ImageIcon />}>
                <ImageGallery images={images} />
              </MediaSection>
            )}

            {shouldShowVideos && (
              <MediaSection title="Videos" icon={<VideoLibraryIcon />}>
                <VideoGallery videos={videos} />
              </MediaSection>
            )}
          </Stack>
        )}

        {!loadingMedia && mediaList.length === 0 && <EmptyState />}

        {pagination && (
          <PaginationControls
            pagination={pagination}
            currentPage={currentPage}
            isLoading={loadingMedia}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Box>
  );
};

export default Home;
