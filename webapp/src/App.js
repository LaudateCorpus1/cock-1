import { Duration } from "luxon";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { STORAGE_COMPLETIONS } from "./constants";
import { completeTask, startDay, stopDay, undoCompletion } from "./app.slice";
import "./App.css";

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;
// TODO: handle sleepTime config
const EIGHT_HOURS = 1000 * 60 * 60 * 8;

function formatDuration(ms) {
  if (ms < 0) ms = 0;
  let duration = Duration.fromMillis(ms).shiftTo(
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
  );
  let text = [];
  let hours = duration.hours;
  if (hours) {
    text.push(`${hours} hours`);
  }
  let minutes = duration.minutes;
  if (minutes) {
    text.push(`${minutes} minutes`);
  }
  let seconds = duration.seconds;
  if (seconds || (!hours && !minutes)) {
    text.push(`${duration.seconds} seconds`);
  }
  return text.join(" ");
}

function BarSegment(props) {
  let { barDuration, segment } = props;
  let segmentSizePercent = (segment.duration / barDuration) * 100;

  return (
    <div
      title={`${segment.task.name} (${formatDuration(segment.duration)})`}
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
  let { tasks, idealDay, maxDuration, duration } = props;
  let segments = [];

  for (let { taskId, duration } of idealDay) {
    segments.push({ task: tasks[taskId], duration });
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
  let { tasks, idealDay, completions, startTime, running, currentTime } = props;

  function determineLastCompletedTime(idx = 0) {
    if (completions.length > idx) {
      return completions[completions.length - (1 + idx)];
    } else {
      return startTime;
    }
  }

  let idealBarDuration = TWENTY_FOUR_HOURS - EIGHT_HOURS;
  let barDuration = currentTime - startTime + 1; // TODO: let's not have the +1 there, and fix the rendering glitch properly
  let barSegments = [];
  for (let i = 0; i < completions.length; i++) {
    let completedTime = completions[i];
    let { taskId } = idealDay[i];
    let task = tasks[taskId];

    // determine last completed time
    let lastCompletedTime = determineLastCompletedTime(1);
    let completedDuration = completedTime / lastCompletedTime;
    barSegments.push({ task, duration: completedDuration });
  }

  // if there's a task in progress, add a segment for that too
  let currentBarDescription = "Not started";
  if (running && completions.length !== idealDay.length) {
    let { taskId, duration: idealDuration } = idealDay[completions.length];
    let task = tasks[taskId];
    let lastCompletedTime = determineLastCompletedTime(0);
    let currentTaskDuration = currentTime - lastCompletedTime;

    let descTarget = `(target: ${formatDuration(idealDuration)})`;
    let descDuration = `(duration: ${formatDuration(currentTaskDuration)})`;

    currentBarDescription = `Now: ${task.name} ${descTarget} ${descDuration})`;

    barSegments.push({ task, duration: currentTaskDuration });
  }

  if (!running) {
    currentBarDescription = "(stopped) " + currentBarDescription;
  }

  let maxDuration = Math.max(idealBarDuration, barDuration);

  return (
    <div className="today-view">
      <div className="today-view-inner">
        <IdealBar
          tasks={tasks}
          idealDay={idealDay}
          maxDuration={maxDuration}
          duration={idealBarDuration}
        />
        <br />
        <Bar
          name={currentBarDescription}
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
  tasks: state.tasks,
  idealDay: state.idealDay,
  completions: state.completions,
  startTime: state.startTime,
  running: state.running,
  currentTime: state.currentTime,
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
