import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // In production, we'd hash this
});

export default mongoose.model('User', userSchema);
