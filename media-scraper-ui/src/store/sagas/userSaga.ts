import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { userService } from "../../services";
import { StatusCode } from "../../types";
import type {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
} from "../../types";
import { login } from "../slices/userSlice";
import { setNoti } from "../slices/notiSlice";
import { setLoadingLogin, setLoadingSignUp } from "../slices/loadingSlice";

// Action types
export const LOGIN_SAGA = "user/loginSaga";
export const SIGNUP_SAGA = "user/signupSaga";

function* loginUser(
  action: PayloadAction<LoginCredentials & { navigate: (path: string) => void }>
) {
  try {
    yield put(setLoadingLogin(true));
    const { username, password, navigate } = action.payload;

    const response: AxiosResponse<AuthResponse> = yield call(() =>
      userService.logIn(username, password)
    );

    if (response.status === StatusCode.SUCCESS) {
      yield put(login(response.data));
      yield put(
        setNoti({ status: response.status, message: "Sign in successfully!" })
      );
      navigate("/");
    }
  } catch (err: any) {
    const { status, data } = err.response || {
      status: 500,
      data: { message: "An error occurred" },
    };
    yield put(setNoti({ status, message: data.message }));
  } finally {
    yield put(setLoadingLogin(false));
  }
}

function* signupUser(
  action: PayloadAction<
    SignUpCredentials & { navigate: (path: string) => void }
  >
) {
  try {
    yield put(setLoadingSignUp(true));
    const { username, password, name, navigate } = action.payload;

    const response: AxiosResponse<AuthResponse> = yield call(() =>
      userService.signUp(username, password, name)
    );

    if (response.status === StatusCode.CREATED) {
      navigate("/sign-in");
      yield put(
        setNoti({
          status: response.status,
          message: "Sign up successfully! Please sign in",
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
    yield put(setLoadingSignUp(false));
  }
}

export function* userSaga() {
  yield takeLatest(LOGIN_SAGA, loginUser);
  yield takeLatest(SIGNUP_SAGA, signupUser);
}
