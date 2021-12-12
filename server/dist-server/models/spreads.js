import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const spreadSchema = new Schema({
  spreads: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
const Spreads = mongoose.model('Spreads', spreadSchema);
export default Spreads;