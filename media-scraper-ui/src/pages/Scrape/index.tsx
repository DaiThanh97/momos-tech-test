import { useMemo } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Box,
  alpha,
  useTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { useAppDispatch, useAppSelector } from "../../store";
import { SCRAPE_URLS_SAGA } from "../../store/sagas/mediaSaga";
import { useUrlParser } from "../../hooks";
import {
  getPageBackground,
  getSecondaryGradient,
  getSecondaryGradientHover,
  getGradientText,
} from "../../utils/styles";

const validationSchema = yup.object({
  urls: yup
    .string()
    .required("URLs are required")
    .test("valid-urls", "Please enter valid URL(s)", (value) => {
      if (!value) return false;
      const urls = value
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);
      const urlRegex =
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
      return urls.length > 0 && urls.every((url) => urlRegex.test(url));
    })
    .test("max-urls", "Maximum 50 URLs allowed per request", (value) => {
      if (!value) return false;
      const urls = value
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);
      return urls.length <= 50;
    }),
});

const Scrape = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loadingScrape } = useAppSelector((state) => state.loading);

  const formik = useFormik({
    initialValues: {
      urls: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const urls = values.urls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);
      dispatch({
        type: SCRAPE_URLS_SAGA,
        payload: { urls, navigate },
      });
    },
  });

  // Use custom hook for URL parsing
  const { urlCount } = useUrlParser(formik.values.urls);

  // Memoize the scrape info list items
  const scrapeInfoItems = useMemo(
    () => [
      "All images (jpg, png, gif, webp, svg)",
      "All videos (mp4, webm, ogg, embedded players)",
      "Page metadata (title, description)",
      "Maximum 50 URLs per request",
    ],
    []
  );

  return (
    <Box sx={getPageBackground(theme)}>
      <Container maxWidth="md">
        <Card
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: 3,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                  mb: 2,
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 32, color: theme.palette.secondary.main }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  ...getGradientText(theme),
                }}
              >
                Scrape URLs
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Extract images and videos from any webpage
              </Typography>

              {urlCount > 0 && (
                <Chip
                  label={`${urlCount} URL${urlCount > 1 ? "s" : ""} ready`}
                  size="small"
                  sx={{
                    mt: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={8}
                id="urls"
                name="urls"
                label="URLs (one per line)"
                placeholder="https://example.com&#10;https://another-site.com&#10;..."
                value={formik.values.urls}
                onChange={formik.handleChange}
                error={formik.touched.urls && Boolean(formik.errors.urls)}
                helperText={formik.touched.urls && formik.errors.urls}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: alpha(
                      theme.palette.background.default,
                      0.3
                    ),
                    fontFamily: "monospace",
                  },
                }}
              />

              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <ImageIcon sx={{ color: theme.palette.info.main }} />
                  <VideoLibraryIcon sx={{ color: theme.palette.info.main }} />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.info.main,
                      fontWeight: 600,
                    }}
                  >
                    What we'll scrape:
                  </Typography>
                </Box>
                <List dense>
                  {scrapeInfoItems.map((text, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 20, color: theme.palette.info.main }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={loadingScrape || urlCount === 0}
                startIcon={
                  loadingScrape ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  ...getSecondaryGradient(theme),
                  "&:hover": getSecondaryGradientHover(theme),
                }}
              >
                {loadingScrape
                  ? "Submitting..."
                  : `Scrape ${urlCount || ""} URL${urlCount !== 1 ? "s" : ""}`}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Scrape;
