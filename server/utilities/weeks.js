import Week from '../models/week.js';

// First date of the season
let currentWeek;

// Each week starts on a Tuesday and ends on a Monday
// export const weeksObj = (() => {
//     const weekObj = {};
//     let startDate = firstDate;
//     for (let i = 1; i <=17; i++) {
//         weekObj[i] = {
//             startDate,
//             endDate: addDays(startDate, 6)
//         }
//         startDate = addDays(startDate, 7);
//     }

//     return weekObj;
// })();

export const getWeekNumber = async (getFromDb = false) => {
	if (!currentWeek || getFromDb) {
		currentWeek = await Week.findOne({name : 'current-week'});
		console.log('testing', currentWeek);
	}
	return currentWeek.value;
    
	// const currentDate = selectedDate ? new Date(selectedDate) : new Date();
	// const weeks = Object.keys(weeksObj);
	// const currentWeek = weeks.find(week => {
	//     return (isSameDay(currentDate, weeksObj[week].startDate) || isAfter(currentDate, weeksObj[week].startDate))
	//             && (isSameDay(currentDate, weeksObj[week].endDate) || isBefore(currentDate, weeksObj[week].endDate));
	// })

	// return currentWeek || 14;
};