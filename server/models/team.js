import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const teamSchema = new Schema({
  ownerId: { type: String, required: true},
  teamName: { type: String, required: true },
  leagueId: { type: String, required: true },
  balance: { type: Number, required: true },
  weekStartBalance: { type: Number, required: false },
  weekEndBalance: { type: Number, required: false },
 }, {
  timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

export default Team;