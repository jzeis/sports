import cron from 'node-cron';
import { getScores } from '../utilities/scores.js';
import { saveSpreads } from '../utilities/spreads.js'; // Schedule tasks to be run on the server.

export const scheduleSpreads = () => cron.schedule('*/15 * * * *', () => {
  console.log('running a task every 15 minutes', new Date().toLocaleTimeString());
  getScores().then(scores => {
    saveSpreads(JSON.stringify(scores));
  });
});