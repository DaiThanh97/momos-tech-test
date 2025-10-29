import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { scraperService } from "../../services";
import { StatusCode } from "../../types";
import type {
  ListMediaParams,
  ScrapeUrlsParams,
  ListMediaResponse,
  ScrapeJob,
} from "../../types";
import { setMedia, clearMedia } from "../slices/mediaSlice";
import { setNoti } from "../slices/notiSlice";
import { setLoadingScrape, setLoadingMedia } from "../slices/loadingSlice";

// Action types
export const SCRAPE_URLS_SAGA = "media/scrapeUrlsSaga";
export const GET_MEDIA_SAGA = "media/getMediaSaga";

function* scrapeUrls(
  action: PayloadAction<ScrapeUrlsParams & { navigate: (path: string) => void }>
) {
  try {
    yield put(setLoadingScrape(true));
    const { urls, navigate } = action.payload;

    const response: AxiosResponse<ScrapeJob[]> = yield call(() =>
      scraperService.scrapeUrls({ urls })
    );

    if (response.status === StatusCode.ACCEPTED) {
      const jobCount = response.data.length;
      navigate("/");
      yield put(
        setNoti({
          status: response.status,
          message: `Successfully queued ${jobCount} URL${
            jobCount > 1 ? "s" : ""
          } for scraping!`,
        })
      );
    }
  } catch (err: any) {
    const { status, data } = err.response || {
      status: 500,
      data: { message: "An error occurred" },
    };
    yield put(setNoti({ status, message: data.message }));
  } finally {
    yield put(setLoadingScrape(false));
  }
}

function* fetchMedia(action: PayloadAction<ListMediaParams>) {
  try {
    yield put(setLoadingMedia(true));
    const params = action.payload;

    const response: AxiosResponse<ListMediaResponse> = yield call(() =>
      scraperService.getMedia(params)
    );

    if (response.status === StatusCode.SUCCESS) {
      yield put(setMedia(response.data));
    }
  } catch (err: any) {
    const { status, data } = err.response || {
      status: 500,
      data: { message: "An error occurred" },
    };
    yield put(setNoti({ status, message: data.message }));
    yield put(clearMedia());
  } finally {
    yield put(setLoadingMedia(false));
  }
}

export function* mediaSaga() {
  yield takeLatest(SCRAPE_URLS_SAGA, scrapeUrls);
  yield takeLatest(GET_MEDIA_SAGA, fetchMedia);
}
