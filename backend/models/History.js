import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modelType: { type: String, required: true }, // 'Brain MRI' or 'Chest X-ray'
  prediction: { type: String, required: true },
  confidence: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('History', historySchema);
