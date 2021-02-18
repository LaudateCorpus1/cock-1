import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  tasks: [],
  idealDay: [],
  completions: [],
  startTime: null,
  running: false,

  // app's
  currentTime: Date.now(),
};

const authSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    replaceState(state, action) {
      const {
        tasks,
        idealDay,
        completions,
        startTime,
        running,
      } = action.payload;
      state.tasks = tasks;
      state.idealDay = idealDay;
      state.completions = completions;
      state.startTime = startTime;
      state.running = running;
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },
    // empty actions for saga's websockes
    startDay() {},
    stopDay() {},
    completeTask() {},
    undoCompletion() {},
  },
});

export const {
  replaceState,
  setCurrentTime,

  startDay,
  stopDay,
  completeTask,
  undoCompletion,
} = authSlice.actions;

export default authSlice.reducer;
