let nonFloat = (x) => {
  if (x % 1 !== 0) {
    throw new Error(
      "You cannot use floating numbers for durations. Consider adding multiple durations instead (e.g. Hours(1) + Minutes(30)."
    );
  } else {
    return x;
  }
};
export let Minutes = (x) => nonFloat(x);
export let Hours = (x) => nonFloat(x) * Minutes(60);

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

export class Task {
  constructor(id, name, count = 1) {
    this._id = id;
    this._name = name;
    this._count = count;
    this._color = pickColor();
  }

  get id() {
    return String(this._id);
  }

  get name() {
    return String(this._name);
  }

  get count() {
    return Boolean(this._count);
  }

  get color() {
    return String(this._color);
  }
}

export class TaskDuration {
  constructor(task, duration) {
    if (!(task instanceof Task)) {
      throw new Error("task is not instance of Task");
    }
    this._task = task;
    this._duration = duration;
  }

  get task() {
    return this._task;
  }

  get duration() {
    return this._duration;
  }
}

export let emptyTask = new Task("empty", "Do whatever!");
export let sleepTask = new Task("sleep", "Sleep");
