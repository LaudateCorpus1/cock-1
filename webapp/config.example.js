import { emptyTask, Minutes, Hours, Task, TaskDuration } from "./config.common";

// how many hours of sleep
export let sleepTime = Hours(8);

let breakfastTask = new Task("breakfast", "eat some breakfast");
let lunchTask = new Task("lunch", "make and eat some lunch");
let dinnerTask = new Task("dinner", "make and eat some dinner");
let workTask = new Task("work", "do some work");

// lists of tasks you made (in order of when to do them)
export let tasks = [breakfastTask, lunchTask, workTask, dinnerTask];

// what your ideal day looks like
export let idealDay = [
  // breakfast
  new TaskDuration(breakfastTask, Minutes(30)),
  new TaskDuration(workTask, Hours(3) + Minutes(30)),

  // lunch
  new TaskDuration(lunchTask, Minutes(30)),
  new TaskDuration(workTask, Hours(4)),
  new TaskDuration(emptyTask, Hours(1) + Minutes(30)),

  // dinner
  new TaskDuration(dinnerTask, Hours(1) + Minutes(30)),
  new TaskDuration(emptyTask, Hours(4) + Minutes(30)),
];
