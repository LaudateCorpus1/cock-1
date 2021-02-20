import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
} from "redux-saga/effects";
import {
  replaceState,
  setCurrentTime,
  startDay,
  stopDay,
  completeTask,
  undoCompletion,
} from "./app.slice";
import { TICKS_PER_SECOND } from "./constants";
import createWebsocket from "./websocket.saga";

function* outgoingSaga(ws) {
  // TODO: i imagine we can simplify this quite a bit
  while (true) {
    const { _startDay, _stopDay, _completeTask, _undoCompletion } = yield race({
      _startDay: take(startDay),
      _stopDay: take(stopDay),
      _completeTask: take(completeTask),
      _undoCompletion: take(undoCompletion),
    });

    if (_startDay) {
      ws.send("start-day");
    } else if (_stopDay) {
      ws.send("stop-day");
    } else if (_completeTask) {
      ws.send("complete-task");
    } else if (_undoCompletion) {
      ws.send("undo-completion");
    }
  }
}

function* incomingSaga(msgChannel) {
  while (true) {
    let msg = yield take(msgChannel);
    let newState = JSON.parse(msg.data);
    console.log(newState);
    yield put(replaceState(newState));
  }
}

function* connectionHandlerSaga(ws, msgChannel) {
  yield all([
    //
    call(incomingSaga, msgChannel),
    call(outgoingSaga, ws),
  ]);
}

function determineWebsocketAddr() {
  let proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  let host = process.env.REACT_APP_WEBSOCKET_HOST || window.location.host;
  let path = process.env.REACT_APP_WEBSOCKET_PATH || "/";
  return `${proto}//${host}${path}`;
}

function* connectionSaga() {
  let websocketAddr = determineWebsocketAddr();
  while (true) {
    let [ws, wsChannel, msgChannel] = yield call(
      createWebsocket,
      websocketAddr
    );

    let handlerTask = yield fork(connectionHandlerSaga, ws, msgChannel);
    while (true) {
      const msg = yield take(wsChannel);
      if (msg.type === "error" || msg.type === "close") {
        yield cancel(handlerTask);
        break;
      }
    }
    // wait some time before reconnecting
    yield delay(1000);
  }
}

function getCurrentTime(state) {
  return state.currentTime;
}

function* tickSaga() {
  while (true) {
    let storeCurrentTime = yield select(getCurrentTime);
    let currentTime = Date.now();
    let isSameSecond =
      Math.floor(storeCurrentTime / 1000) === Math.floor(currentTime / 1000);
    if (!isSameSecond) {
      yield put(setCurrentTime(currentTime));
    }
    yield delay(1000 / TICKS_PER_SECOND);
  }
}

function* tickMonitorSaga() {
  let tickTask = null;
  while (true) {
    let { payload: newState } = yield take(replaceState);
    if (!newState.running) {
      if (tickTask) {
        yield cancel(tickTask);
        tickTask = null;
      }
    } else {
      if (!tickTask) {
        tickTask = yield fork(tickSaga);
      }
    }
  }
}

function* appSaga() {
  yield all([
    //
    call(tickMonitorSaga),
    call(connectionSaga),
  ]);
}

export default appSaga;
