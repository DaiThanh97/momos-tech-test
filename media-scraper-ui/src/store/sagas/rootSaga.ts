import { all, fork } from "redux-saga/effects";
import { userSaga } from "./userSaga";
import { mediaSaga } from "./mediaSaga";

export default function* rootSaga() {
  yield all([fork(userSaga), fork(mediaSaga)]);
}
