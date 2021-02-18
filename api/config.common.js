let nonFloat = (x) => {
  if (x % 1 !== 0) {
    throw new Error(
      "You cannot use floating numbers for durations. Consider adding multiple durations instead (e.g. Hours(1) + Minutes(30)."
    );
  } else {
    return x;
  }
};
let Minutes = (x) => nonFloat(x) * 60 * 1000;
let Hours = (x) => nonFloat(x) * Minutes(60);

let colors = [
  "#d81b60",
  "#ea80fc",
  "#ff9e80",
  "#80d8ff",
  "#8e24aa",
  "#00acc1",
  "#43a047",
  "#039be5",
  "#b388ff",
  "#3949ab",
  "#1e88e5",
  "#fdd835",
  "#f4511e",
  "#ffff8d",
  "#ff80ab",
  "#c0ca33",
  "#7cb342",
  "#fb8c00",
  "#82b1ff",
  "#ffe57f",
  "#f4ff81",
  "#84ffff",
  "#ff8a80",
  "#5e35b1",
  "#00897b",
  "#b9f6ca",
  "#ffb300",
  "#e53935",
  "#ccff90",
  "#a7ffeb",
  "#8c9eff",
  "#ffd180",
];
let colorIndex = 0;
function pickColor() {
  let selectedColor = colors[colorIndex];
  if (colorIndex === colors.length - 1) {
    colorIndex = 0;
  } else {
    colorIndex += 1;
  }
  return selectedColor;
}

function Task(id, name, count = 1) {
  return {
    id: String(id),
    name: String(name),
    count: Number(count),
    color: id === "empty" ? "#DDDDDD" : pickColor(),
  };
}

function TaskDuration(task, duration) {
  return {
    taskId: task.id,
    duration,
  };
}

let emptyTask = Task("empty", "Do whatever!");
let sleepTask = Task("sleep", "Sleep");

module.exports = {
  Minutes,
  Hours,
  Task,
  TaskDuration,
  emptyTask,
  sleepTask,
};
