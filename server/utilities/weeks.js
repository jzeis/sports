import Week from '../models/week.js';

let currentWeek;

export const getWeekNumber = async (getFromDb = false) => {
  if (!currentWeek || getFromDb) {
    currentWeek = await Week.findOne({name : 'current-week'});
  }
  return parseInt(currentWeek.value);
};

export const incrementWeekNumber = async () => {
  const curWeek = await Week.findOne({name : 'current-week'});
  curWeek.value++;
  currentWeek = curWeek;
  curWeek.save();
};