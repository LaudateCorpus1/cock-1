const {
  emptyTask,
  Minutes,
  Hours,
  Task,
  TaskDuration,
} = require("./config.common");

// how many hours of sleep
let sleepTime = Hours(8);

let breakfastTask = Task("breakfast", "eat some breakfast");
let lunchTask = Task("lunch", "make and eat some lunch");
let dinnerTask = Task("dinner", "make and eat some dinner");
let workTask = Task("work", "do some work");

// lists of tasks you made (in order of when to do them)
let tasks = [emptyTask, breakfastTask, lunchTask, workTask, dinnerTask];

// what your ideal day looks like
let idealDay = [
  // breakfast
  TaskDuration(breakfastTask, Minutes(30)),
  TaskDuration(workTask, Hours(3) + Minutes(30)),

  // lunch
  TaskDuration(lunchTask, Minutes(30)),
  TaskDuration(workTask, Hours(4)),
  TaskDuration(emptyTask, Hours(1) + Minutes(30)),

  // dinner
  TaskDuration(dinnerTask, Hours(1) + Minutes(30)),
  TaskDuration(emptyTask, Hours(4) + Minutes(30)),
];

module.exports = {
  sleepTime,
  tasks,
  idealDay,
};
