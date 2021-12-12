import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  commishionerId: { type: String, required: true},
  leagueName: {type: String, required: true},
  password: {type: String, required: false},
  teams: { type: [String], required: false },
  maxTeams: { type: Number, required: false },
  startingBalance: { type: Number, required: true },
  startWeek: { type: String, required: true },
  startDate: { type: Date, required: true },
  endWeek: { type: String, required: true },
  endDate: { type: Date, required: true },
  currentWeek: { type: String, required: false }  
 }, {
  timestamps: true,
});

const League = mongoose.model('League', leagueSchema);

export default League;