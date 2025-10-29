import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userReducer from "./slices/userSlice";
import mediaReducer from "./slices/mediaSlice";
import loadingReducer from "./slices/loadingSlice";
import notiReducer from "./slices/notiSlice";
import rootSaga from "./sagas/rootSaga";
import type { RootState } from "../types";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    user: userReducer,
    media: mediaReducer,
    loading: loadingReducer,
    noti: notiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "user/loginSaga",
          "user/signupSaga",
          "media/scrapeUrlsSaga",
          "media/getMediaSaga",
        ],
        ignoredActionPaths: ["payload.navigate"],
        ignoredPaths: [],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
