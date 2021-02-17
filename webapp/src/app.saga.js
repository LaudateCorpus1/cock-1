import {
  all,
  call,
  delay,
  put,
  race,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";
import {
  startDay,
  stopDay,
  setStartTime,
  setCurrentTime,
  completeTask,
  addCompletionTime,
} from "./app.slice";
import { TICKS_PER_SECOND } from "./constants";

function getCurrentTime(state) {
  return state.currentTime;
}

function getNow() {
  return Math.floor(Date.now() / 1000);
}

function* runDaySaga() {
  yield put(setStartTime(getNow()));
  while (true) {
    let storeCurrentTime = yield select(getCurrentTime);
    let currentTime = getNow();
    if (storeCurrentTime !== getNow()) {
      yield put(setCurrentTime(currentTime));
    }
    yield delay(1000 / TICKS_PER_SECOND);
  }
}

function* taskCompletionTrackerSaga() {
  while (true) {
    yield take(completeTask);
    yield put(addCompletionTime(getNow()));
  }
}

function* startDaySaga() {
  yield race([
    //
    call(runDaySaga),
    call(taskCompletionTrackerSaga),
    take(stopDay),
  ]);
}

function* appSaga() {
  yield all([
    //
    takeLatest(startDay, startDaySaga),
  ]);
}

export default appSaga;
