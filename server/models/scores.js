
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const scoresSchema = new Schema({
  scores: { type: String, required: true },
  name: { type: String, required: true },
}, {
  timestamps: true,
});

const Scores = mongoose.model('Scores', scoresSchema);

export default Scores;