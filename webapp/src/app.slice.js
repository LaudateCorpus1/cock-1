import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  startTime: null,
  currentTime: null,
  taskCompletions: [],
};

const authSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    startDay(state) {
      state.startTime = null;
      state.currentTime = null;
      state.taskCompletions = [];
    },
    stopDay(state) {
      // empty action
    },
    setStartTime(state, action) {
      state.startTime = action.payload;
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },
    completeTask(state) {
      // empty action
    },
    addCompletionTime(state, action) {
      state.taskCompletions.push(action.payload);
      console.log("completion list", Array.from(state.taskCompletions));
    },
    undoCompletion(state) {
      if (state.taskCompletions.length) {
        state.taskCompletions.pop();
      }
      console.log("completion list", Array.from(state.taskCompletions));
    },
  },
});

export const {
  startDay,
  stopDay,
  setStartTime,
  setCurrentTime,
  completeTask,
  addCompletionTime,
  undoCompletion,
} = authSlice.actions;

export default authSlice.reducer;
