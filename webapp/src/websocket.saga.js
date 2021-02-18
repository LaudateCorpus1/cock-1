import { eventChannel, buffers } from "redux-saga";

function createWebsocket(addr) {
  let ws = null;
  let emitMessage = null;
  let wsEventChannel = eventChannel((emit) => {
    ws = new WebSocket(addr);
    ws.onopen = (evt) => {
      emit({ type: "open", evt });
    };
    ws.onerror = (evt) => {
      emit({ type: "error", evt });
      ws.close();
    };
    ws.onclose = (evt) => {
      emit({ type: "close", evt });
    };
    ws.onmessage = (msg) => {
      if (emitMessage) {
        emitMessage(msg);
      }
    };
    return () => {
      ws.close();
    };
  }, buffers.expanding());

  let messageEventChannel = eventChannel((_emitMessage) => {
    emitMessage = _emitMessage;

    return () => {
      emitMessage = null;
    };
  }, buffers.expanding());

  return [ws, wsEventChannel, messageEventChannel];
}

export default createWebsocket;
