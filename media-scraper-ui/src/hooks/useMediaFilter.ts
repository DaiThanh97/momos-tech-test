import { useMemo } from "react";
import { MediaType, type MediaItem } from "../types";

export const useMediaFilter = (mediaList: MediaItem[]) => {
  const images = useMemo(
    () => mediaList.filter((item) => item.type === MediaType.IMAGE),
    [mediaList]
  );

  const videos = useMemo(
    () => mediaList.filter((item) => item.type === MediaType.VIDEO),
    [mediaList]
  );

  return { images, videos };
};
