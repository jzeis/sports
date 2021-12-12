 
import express from 'express';
const router = express.Router();
import Scores from '../models/scores.js';
import { getWeeksObj } from '../utilities/weeks.js';
import { isAfter, isBefore, isSameDay } from 'date-fns';

const weeks = getWeeksObj();

router.route('/:week?').get((req, res) => {
    const name = req.params.week ? `week${req.params.week}-spreads` : 'latestSpreads'
    Scores.findOne({name: name})
    .then(data => {
        const spreadList = JSON.parse(data.spreads);
        const selectedWeek = req.params.week; 
        const startDate = new Date(weeks[selectedWeek].startDate);
        const endDate = new Date(weeks[selectedWeek].endDate);

        const filteredSpreadList = spreadList.filter(game => {
            const gameDate = new Date(game.commence_time);
            return (isSameDay(gameDate, startDate) || isAfter(gameDate, startDate))
                && (isSameDay(gameDate, endDate) || isBefore(gameDate, endDate));
        })
        res.json(filteredSpreadList);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/add').post((req, res) => {
//   const username = req.body.username;

//   const newUser = new User({username});

//   newUser.save()
//     .then(() => res.json('User added!'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

export default router;

