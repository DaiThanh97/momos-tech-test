import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LoadingState } from "../../types";

const initialState: LoadingState = {
  loadingLogin: false,
  loadingSignUp: false,
  loadingScrape: false,
  loadingMedia: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoadingLogin: (state, action: PayloadAction<boolean>) => {
      state.loadingLogin = action.payload;
    },
    setLoadingSignUp: (state, action: PayloadAction<boolean>) => {
      state.loadingSignUp = action.payload;
    },
    setLoadingScrape: (state, action: PayloadAction<boolean>) => {
      state.loadingScrape = action.payload;
    },
    setLoadingMedia: (state, action: PayloadAction<boolean>) => {
      state.loadingMedia = action.payload;
    },
  },
});

export const {
  setLoadingLogin,
  setLoadingSignUp,
  setLoadingScrape,
  setLoadingMedia,
} = loadingSlice.actions;
export default loadingSlice.reducer;
