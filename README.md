# Medical Imaging Diagnosis based on Deep Learning

This is a full-stack platform for uploading medical scans (Brain MRI & Chest X-ray) and receiving AI-powered predictions, complete with history tracking.

## Technical Details
- **Frontend**: React.js with clear glassmorphism premium UI.
- **Backend API**: Node.js & Express.
- **AI Service**: Python & FastAPI with TensorFlow models.
- **Database**: MongoDB Atlas.

## Prerequisites
1. **Node.js** v18+
2. **Python** 3.10+
3. **MongoDB Atlas Account**: You need a connection string to your MongoDB cluster.
4. **Kaggle API Credentials**: Used to download datasets.

## Setup Instructions

### 1. Kaggle & Python Setup
1. Create a Kaggle account if you don't have one and generate an API token (`kaggle.json`).
2. Place `kaggle.json` inside your `%USERPROFILE%\.kaggle\` directory (Windows) or `~/.kaggle/` (Mac/Linux).
3. Open a terminal in `ai-service`:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   ```
4. Run the training script. This downloads the images from Kaggle and trains lightweight `.h5` CNN models.
   ```bash
   python train_model.py
   ```
5. Once trained, start the AI Fast API service.
   ```bash
   uvicorn app:app --reload --port 8000
   ```

### 2. Node.js Backend Setup
1. Open a new terminal in `backend`.
2. Create a `.env` file in the `backend` folder:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=5000
   PYTHON_API_URL=http://127.0.0.1:8000
   ```
3. Run the backend:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal in `frontend`.
2. Install dependencies & run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the URL shown (usually `http://localhost:5173`) in your browser to view the premium dashboard. Create an account, upload an image from your downloaded datasets, and witness the diagnosis in real-time.

# medical-imaging-computer-vision-deep-learning
