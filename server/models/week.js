import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const weekSchema = new Schema({
	name: {type: String, required: true},
	value: {type: Number, required: true},
}, {
	timestamps: true,
});

const Week = mongoose.model('Week', weekSchema);

export default Week;