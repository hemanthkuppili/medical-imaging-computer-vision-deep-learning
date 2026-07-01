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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_imaging';
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';
const PORT = process.env.PORT || 5000;

let isDbConnected = false;

// ✅ Middleware MUST be defined BEFORE routes in Express
function requireDb(req, res, next) {
  if (!isDbConnected) {
    return res.status(503).json({
      error: 'Database not connected. Please whitelist your IP in MongoDB Atlas → Security → Network Access.'
    });
  }
  next();
}

// ✅ Apply DB guard BEFORE defining routes
app.use('/api/signup', requireDb);
app.use('/api/login', requireDb);
app.use('/api/history', requireDb);

// --- Auth Routes ---
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

// --- History Route ---
app.get('/api/history/:userId', async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Predict Route (works without DB) ---
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const { userId, modelType } = req.body;
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

    // Save to MongoDB only if connected (non-blocking)
    if (isDbConnected) {
      try {
        const historyEntry = new History({ userId, modelType: model, prediction, confidence });
        await historyEntry.save();
      } catch (saveError) {
        console.warn('⚠️  Could not save history to MongoDB:', saveError.message);
      }
    }

    fs.unlinkSync(req.file.path);

    res.json({ message: 'Prediction successful', prediction, confidence, model });

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error(err);
    res.status(500).json({ error: err.response?.data?.detail || err.message });
  }
});

// --- Start Server ---
async function startServer() {
  // Start HTTP server immediately — don't wait for DB
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
  });

  // Attempt MongoDB connection in background
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    isDbConnected = true;
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed (server still running without DB)');
    console.warn('   Error:', err.message);
    console.warn('   👉 Fix: MongoDB Atlas → Security → Network Access → Add IP: 0.0.0.0/0');
  }
}

startServer();
