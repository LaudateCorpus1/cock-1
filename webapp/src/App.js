import * as config from "./config";
import { Hours } from "./config.common";
import "./App.css";
import { useEffect, useState } from "react";

// at which time is kept track of in bars
const TICKS_PER_SECOND = 30;
// at which we trigger a new render of the bars
const FRAMES_PER_SECOND = 1;
// localstorage item name (keeping track of task completions)
const STORAGE_COMPLETIONS = "completions";

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

function TodayControls() {
  return (
    <div className="today-controls">
      <button>Stop day</button> <button>Start day</button>{" "}
      <button>Undo completion</button> <button>Mark complete: TODO</button>
    </div>
  );
}

function TodayView() {
  let idealBarDuration = Hours(24) - config.sleepTime;
  // TODO: barDuration
  let maxDuration = Math.max(idealBarDuration);
  return (
    <div className="today-view">
      <div className="today-view-inner">
        <IdealBar maxDuration={maxDuration} duration={idealBarDuration} />
        <br />
        <IdealBar maxDuration={maxDuration} duration={idealBarDuration} />
        <br />
        <br />
        <TodayControls />
      </div>
    </div>
  );
}

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
