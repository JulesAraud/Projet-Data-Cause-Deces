import mongoose from 'mongoose';

const deathSchema = new mongoose.Schema({}, { strict: false });

const Death = mongoose.model('Death', deathSchema, 'Death-cause');

export default Death;
