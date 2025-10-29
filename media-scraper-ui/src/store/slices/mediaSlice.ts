import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  MediaState,
  ListMediaResponse,
  MediaTypeFilter,
} from "../../types";

const initialState: MediaState = {
  mediaList: [],
  pagination: null,
  currentFilter: "all" as MediaTypeFilter,
  searchText: "",
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMedia: (state, action: PayloadAction<ListMediaResponse>) => {
      state.mediaList = action.payload.data;
      state.pagination = action.payload.meta;
    },
    appendMedia: (state, action: PayloadAction<ListMediaResponse>) => {
      state.mediaList = [...state.mediaList, ...action.payload.data];
      state.pagination = action.payload.meta;
    },
    clearMedia: (state) => {
      state.mediaList = [];
      state.pagination = null;
    },
    setFilter: (state, action: PayloadAction<MediaTypeFilter>) => {
      state.currentFilter = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
  },
});

export const { setMedia, appendMedia, clearMedia, setFilter, setSearchText } =
  mediaSlice.actions;
export default mediaSlice.reducer;
