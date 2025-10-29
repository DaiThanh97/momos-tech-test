import { useMemo } from "react";

export const useUrlParser = (urlsText: string) => {
  const urls = useMemo(() => {
    return urlsText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
  }, [urlsText]);

  const urlCount = urls.length;

  return { urls, urlCount };
};
