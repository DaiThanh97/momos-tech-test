import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NotiState } from "../../types";

const initialState: NotiState = {
  noti: {
    status: 0,
    message: "",
  },
};

const notiSlice = createSlice({
  name: "noti",
  initialState,
  reducers: {
    setNoti: (
      state,
      action: PayloadAction<{ status: number; message: string }>
    ) => {
      state.noti = action.payload;
    },
    clearNoti: (state) => {
      state.noti = { status: 0, message: "" };
    },
  },
});

export const { setNoti, clearNoti } = notiSlice.actions;
export default notiSlice.reducer;
