import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { STORAGE_COMPLETIONS } from "./constants";
import * as config from "./config";
import { completeTask, startDay, stopDay, undoCompletion } from "./app.slice";
import { Hours, TaskDuration } from "./config.common";
import "./App.css";

function BarSegment(props) {
  let { barDuration, segment } = props;
  let segmentSizePercent = (segment.duration / barDuration) * 100;

  return (
    <div
      title={`${segment.task.name} (${segment.duration} minutes)`}
      className="bar-segment"
      style={{
        width: `${segmentSizePercent}%`,
        backgroundColor: segment.task.color,
      }}
    />
  );
}

function Bar(props) {
  let { name, maxDuration, duration, segments } = props;

  let barSizePercent = (duration / maxDuration) * 100;
  return (
    <div className="bar-container">
      <span className="bar-title">{name}</span>
      <div
        className="bar"
        style={{
          width: `${barSizePercent}%`,
        }}
      >
        {segments.map((segment, idx) => {
          return (
            <BarSegment key={idx} barDuration={duration} segment={segment} />
          );
        })}
      </div>
    </div>
  );
}

function IdealBar(props) {
  let { maxDuration, duration } = props;
  let segments = [];

  for (let job of config.idealDay) {
    segments.push(job);
  }

  return (
    <Bar
      name="Ideal"
      maxDuration={maxDuration}
      duration={duration}
      segments={segments}
    />
  );
}

function TodayControls(props) {
  let { startDay, stopDay, undoCompletion, completeTask } = props;
  return (
    <div className="today-controls">
      <button onClick={() => stopDay()}>Stop day</button>{" "}
      <button onClick={() => startDay()}>Start day</button>{" "}
      <button onClick={() => undoCompletion()}>Undo completion</button>{" "}
      <button onClick={() => completeTask()}>Mark complete: TODO</button>
    </div>
  );
}
TodayControls = connect(null, {
  startDay,
  stopDay,
  completeTask,
  undoCompletion,
})(TodayControls);

function TodayView(props) {
  let { startTime, currentTime, taskCompletions } = props;

  let idealBarDuration = Hours(24) - config.sleepTime;
  let barDuration = currentTime / 60 - startTime / 60;
  let barSegments = [];
  for (let i = 0; i < taskCompletions.length; i++) {
    let taskCompletedTime = taskCompletions[i];
    let task = config.idealDay[i];
    if (task == null) break; // TODO: handle this error (because we shouldn't push completion times for nonexistent tasks)
    let lastCompletedTime = null;
    if (i !== 0) {
      lastCompletedTime = taskCompletions[i - 1];
    } else {
      lastCompletedTime = startTime;
    }
    let completedTaskDuration = taskCompletedTime / 60 - lastCompletedTime / 60;
    barSegments.push(new TaskDuration(task.task, completedTaskDuration));
  }
  let currentTask = config.idealDay[taskCompletions.length];
  if (currentTask == null) {
    // TODO: handle this error (because ticking should stop when we complete all tasks)
    currentTask = config.idealDay[config.idealDay.length - 1];
  }
  let lastCompletedTime = null;
  if (taskCompletions.length) {
    lastCompletedTime = taskCompletions[taskCompletions.length - 1];
  } else {
    lastCompletedTime = startTime;
  }
  let currentTaskDuration = currentTime / 60 - lastCompletedTime / 60;
  barSegments.push(new TaskDuration(currentTask.task, currentTaskDuration));

  let maxDuration = Math.max(idealBarDuration, barDuration);
  return (
    <div className="today-view">
      <div className="today-view-inner">
        <IdealBar maxDuration={maxDuration} duration={idealBarDuration} />
        <br />
        <Bar
          name={`Now: ${currentTask.task.name} (duration: ${Math.round(
            currentTaskDuration
          )} minutes ${Math.round((currentTaskDuration * 60) % 60)} seconds)`}
          maxDuration={maxDuration}
          duration={barDuration}
          segments={barSegments}
        />
        <br />
        <br />
        <TodayControls />
      </div>
    </div>
  );
}
TodayView = connect((state) => ({
  startTime: state.startTime,
  currentTime: state.currentTime,
  taskCompletions: state.taskCompletions,
}))(TodayView);

function Header() {
  return (
    <div className="header">
      <div className="header-inner">Today's View</div>
    </div>
  );
}

function Main() {
  return (
    <div className="main">
      <Header />
      <div className="main-inner">
        <TodayView />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-inner">sidebar</div>
    </div>
  );
}

function App() {
  let [completions, setCompletions] = useState(null);

  useEffect(() => {
    let rawCompletions = localStorage.getItem(STORAGE_COMPLETIONS);
    if (rawCompletions != null) {
      setCompletions(JSON.parse(rawCompletions));
    } else {
      updateCompletions([]);
    }
  }, []);

  function updateCompletions(newCompletions) {
    localStorage.setItem(STORAGE_COMPLETIONS, JSON.stringify(newCompletions));
    setCompletions(newCompletions);
  }

  if (completions == null) {
    return null;
  }

  return (
    <div className="app">
      <Main />
      <Sidebar />
    </div>
  );
}

export default App;
