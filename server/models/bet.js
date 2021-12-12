import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const betSchema = new Schema({
  userId: {type: String, required: true},
  teamId: {type: String, required: true},
  team: { type: String, required: true },
  points: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  gameDate: { type: Date, required: true},
  gameWeek: { type: Number, required: true },
  result: { type: String, required: false},
  processed: { type: Boolean, required: false}
 }, {
  timestamps: true,
});

const Bet = mongoose.model('Bet', betSchema);

export default Bet;