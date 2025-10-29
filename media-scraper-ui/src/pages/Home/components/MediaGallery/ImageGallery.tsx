import { memo, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  alpha,
  useTheme,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type { MediaItem } from "../../../../types";

interface ImageGalleryProps {
  images: MediaItem[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleOpenImage = useCallback((url: string) => {
    setSelectedImage(url);
  }, []);

  const handleCloseImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleOpenInNewTab = useCallback((e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fill, minmax(150px, 1fr))",
            sm: "repeat(auto-fill, minmax(200px, 1fr))",
            md: "repeat(auto-fill, minmax(250px, 1fr))",
          },
          gap: 2,
        }}
      >
        {images.map((media, index) => (
          <Card
            key={`${media.jobId}-${index}`}
            sx={{
              position: "relative",
              cursor: "pointer",
              overflow: "hidden",
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: `0 8px 24px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
                "& .overlay": {
                  opacity: 1,
                },
              },
            }}
            onClick={() => handleOpenImage(media.url)}
          >
            <CardMedia
              component="img"
              image={media.url}
              alt={media.pageTitle || "Scraped image"}
              sx={{
                height: 200,
                objectFit: "cover",
              }}
              onError={(e: any) => {
                e.target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage Error%3C/text%3E%3C/svg%3E";
              }}
            />
            <Box
              className="overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: alpha(theme.palette.background.paper, 0.9),
                opacity: 0,
                transition: "opacity 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => handleOpenInNewTab(e, media.url)}
                sx={{
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                <OpenInNewIcon />
              </IconButton>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {media.pageTitle || media.sourceUrl}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Dialog
        open={!!selectedImage}
        onClose={handleCloseImage}
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={handleCloseImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
              }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default memo(ImageGallery);
