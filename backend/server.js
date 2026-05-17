import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';
import User from './models/User.js';
import History from './models/History.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_imaging';
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('MongoDB connected');
    mongoose.set('bufferCommands', false); // Disable buffering
  })
  .catch(err => console.log('MongoDB is disconnected. Operating in offline history mode!'));

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

// Simple Auth
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    
    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// History Endpoint
app.get('/api/history/:userId', async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Predict Endpoint
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    
    const { userId, modelType } = req.body; // 'brain' or 'chest'
    if (!userId || !modelType) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Missing userId or modelType' });
    }

    // Forward image to Python AI Service
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const endpoint = modelType === 'brain' ? '/predict/brain' : '/predict/chest';
    
    const pyResponse = await axios.post(`${PYTHON_API_URL}${endpoint}`, formData, {
      headers: formData.getHeaders()
    });

    const { prediction, confidence, model } = pyResponse.data;

    // Save history to MongoDB (gracefully handle if MongoDB isn't connected)
    try {
      const historyEntry = new History({
        userId,
        modelType: model,
        prediction,
        confidence
      });
      await historyEntry.save();
    } catch (saveError) {
      console.warn("Could not save to MongoDB (likely IP not whitelisted or offline), but prediction succeeded:", saveError.message);
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Prediction successful',
      prediction,
      confidence,
      model
    });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error(err);
    res.status(500).json({ error: err.response?.data?.detail || err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
