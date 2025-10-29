import { memo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Chip,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LinkIcon from "@mui/icons-material/Link";
import type { MediaItem } from "../../../../types";

interface VideoGalleryProps {
  videos: MediaItem[];
}

const VideoGallery = ({ videos }: VideoGalleryProps) => {
  const theme = useTheme();

  const handleOpenVideo = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(auto-fill, minmax(300px, 1fr))",
        },
        gap: 3,
      }}
    >
      {videos.map((media, index) => (
        <Card
          key={`${media.jobId}-${index}`}
          sx={{
            backgroundColor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `0 12px 40px ${alpha(
                theme.palette.primary.main,
                0.2
              )}`,
              borderColor: alpha(theme.palette.primary.main, 0.3),
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <PlayCircleOutlineIcon
                  sx={{
                    fontSize: 40,
                    color: theme.palette.secondary.main,
                  }}
                />
              </Box>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {media.pageTitle || "Video"}
                </Typography>

                <Chip
                  label="VIDEO"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    color: theme.palette.secondary.main,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                padding: 1.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <LinkIcon
                sx={{
                  fontSize: 16,
                  color: theme.palette.text.secondary,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                }}
              >
                {media.sourceUrl}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleOpenVideo(media.sourceUrl)}
                sx={{
                  flex: 1,
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <OpenInNewIcon fontSize="small" />
                <Typography variant="caption" sx={{ ml: 0.5 }}>
                  Open Video
                </Typography>
              </IconButton>
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "block",
                mt: 2,
                textAlign: "center",
              }}
            >
              Scraped {new Date(media.scrapedAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default memo(VideoGallery);
