import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userService } from "../../services";
import type { UserState, AuthResponse } from "../../types";

const initialState: UserState = {
  username: "",
  name: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      const { accessToken, username, name } = action.payload;
      userService.setToken(accessToken);
      userService.setName(name);
      state.name = name;
      state.username = username;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      userService.clearStorage();
      state.isLoggedIn = false;
      state.username = "";
      state.name = "";
    },
    checkLogin: (state) => {
      const isTokenExpired = userService.isTokenExpired();
      if (isTokenExpired) {
        state.isLoggedIn = false;
        state.username = "";
        state.name = "";
      } else {
        state.isLoggedIn = true;
        state.name = userService.getName() || "";
      }
    },
  },
});

export const { login, logout, checkLogin } = userSlice.actions;
export default userSlice.reducer;
