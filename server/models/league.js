import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  commishionerId: { type: String, required: true},
  leagueName: {type: String, required: true},
  password: {type: String, required: true},
  teams: { type: [String], required: false },
  maxTeams: { type: Number, required: false },
  startingBalance: { type: Number, required: true },
  startWeek: { type: Number, required: true },
  endWeek: { type: Number, required: true },
  currentWeek: { type: Number, required: false }  
}, {
  timestamps: true,
});

const League = mongoose.model('League', leagueSchema);

export default League;