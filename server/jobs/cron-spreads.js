import cron from 'node-cron';
import { getScores } from '../utilities/scores.js';
import { fetchSpreads, saveSpreads } from '../utilities/spreads.js';

// Schedule tasks to be run on the server.
export const scheduleSpreads = () => cron.schedule('*/15 * * * *', () => {
    console.log('running a task every 10 minutes', new Date().toLocaleTimeString());
    getScores().then(scores => {
        saveSpreads(JSON.stringify(scores));
      });
    if (false) {
        fetchSpreads();
    }
});