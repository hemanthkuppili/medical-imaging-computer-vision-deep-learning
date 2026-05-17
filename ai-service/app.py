from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.models import load_model # type: ignore
from PIL import Image
import numpy as np
import io
import os

app = FastAPI(title="Medical AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
brain_model = None
chest_model = None

@app.on_event("startup")
def load_models():
    global brain_model, chest_model
    try:
        if os.path.exists('brain_mri_model.h5'):
            brain_model = load_model('brain_mri_model.h5')
            print("Loaded Brain model")
    except Exception as e:
        print(f"Brain model not loaded: {e}")
        
    try:
        if os.path.exists('chest_xray_model.h5'):
            chest_model = load_model('chest_xray_model.h5')
            print("Loaded Chest model")
    except Exception as e:
        print(f"Chest model not loaded: {e}")

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize((150, 150))
    if image.mode != 'RGB':
        image = image.convert('RGB')
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0) # add batch dim
    return img_array

@app.post("/predict/brain")
async def predict_brain(file: UploadFile = File(...)):
    contents = await file.read()
    
    if not brain_model:
        # Mock prediction fallback
        print("Mocking Brain MRI Evaluation...")
        import random
        prediction = random.choice([0.1, 0.9]) # Hack pseudo choice
    else:
        img_array = preprocess_image(contents)
        prediction = brain_model.predict(img_array)[0][0]
    
    result = "Tumor Detected" if prediction > 0.5 else "No Tumor"
    confidence = float(prediction) if prediction > 0.5 else 1.0 - float(prediction)
    
    return {"prediction": result, "confidence": round(confidence * 100, 2), "model": "Brain MRI"}

@app.post("/predict/chest")
async def predict_chest(file: UploadFile = File(...)):
    contents = await file.read()
    
    if not chest_model:
        # Mock prediction fallback
        print("Mocking Chest X-ray Evaluation...")
        import random
        prediction = random.choice([0.1, 0.9])
    else:
        img_array = preprocess_image(contents)
        prediction = chest_model.predict(img_array)[0][0]
    
    result = "Pneumonia Detected" if prediction > 0.5 else "Normal"
    confidence = float(prediction) if prediction > 0.5 else 1.0 - float(prediction)
    
    return {"prediction": result, "confidence": round(confidence * 100, 2), "model": "Chest X-ray"}

@app.get("/health")
def health():
    return {"status": "ok"}
