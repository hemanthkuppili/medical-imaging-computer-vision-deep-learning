import os
import subprocess
import tensorflow as tf
from dotenv import load_dotenv
load_dotenv() # Injects KAGGLE_USERNAME and KAGGLE_KEY into environment variables
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import EarlyStopping

import sys
import kaggle

def download_datasets():
    print("Downloading Brain MRI dataset...")
    kaggle.api.dataset_download_cli("navoneel/brain-mri-images-for-brain-tumor-detection", unzip=True, path="./data/brain_mri")
    
    print("Downloading Chest X-ray dataset...")
    kaggle.api.dataset_download_cli("paultimothymooney/chest-xray-pneumonia", unzip=True, path="./data/chest_xray")


def build_model(input_shape):
    base_model = MobileNetV2(input_shape=input_shape, include_top=False, weights='imagenet')
    base_model.trainable = False # Freeze base model
    
    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dense(128, activation='relu'),
        Dropout(0.5),
        Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005), 
                  loss='binary_crossentropy', 
                  metrics=['accuracy'])
    return model

def train_brain_mri_model():
    print("Training Brain MRI Model...")
    base_dir = './data/brain_mri' # This path may vary slightly based on exact kaggle unzip structure
    
    # We will use ImageDataGenerator for simple train/val split if the dataset 
    # doesn't have predefined splits. Often 'brain_tumor_dataset' is created inside.
    dataset_dir = os.path.join(base_dir, 'brain_tumor_dataset')
    
    if not os.path.exists(dataset_dir):
        dataset_dir = base_dir # fallback
    
    datagen_train = ImageDataGenerator(
        rescale=1./255, 
        validation_split=0.2,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True
    )
    datagen_val = ImageDataGenerator(rescale=1./255, validation_split=0.2)
    
    train_gen = datagen_train.flow_from_directory(
        dataset_dir, target_size=(150, 150), batch_size=32, class_mode='binary', subset='training'
    )
    val_gen = datagen_val.flow_from_directory(
        dataset_dir, target_size=(150, 150), batch_size=32, class_mode='binary', subset='validation'
    )
    
    model = build_model((150, 150, 3))
    
    early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
    model.fit(train_gen, validation_data=val_gen, epochs=10, callbacks=[early_stop])
    model.save('brain_mri_model.h5')
    print("Saved brain_mri_model.h5")

def train_chest_xray_model():
    print("Training Chest X-ray Model...")
    # chest_xray has train, test, val folders
    train_dir = './data/chest_xray/chest_xray/train'
    val_dir = './data/chest_xray/chest_xray/val'
    
    if not os.path.exists(train_dir):
        print("Chest X-ray directories not found properly. Skipping or adjust path.")
        return
        
    datagen_train = ImageDataGenerator(
        rescale=1./255,
        rotation_range=15,
        zoom_range=0.1,
        horizontal_flip=True
    )
    datagen_val = ImageDataGenerator(rescale=1./255)
    
    train_gen = datagen_train.flow_from_directory(
        train_dir, target_size=(150, 150), batch_size=32, class_mode='binary'
    )
    val_gen = datagen_val.flow_from_directory(
        val_dir, target_size=(150, 150), batch_size=32, class_mode='binary'
    )
    
    model = build_model((150, 150, 3))
    early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
    model.fit(train_gen, validation_data=val_gen, epochs=10, callbacks=[early_stop])
    model.save('chest_xray_model.h5')
    print("Saved chest_xray_model.h5")

if __name__ == "__main__":
    download_datasets()
    try:
        train_brain_mri_model()
    except Exception as e:
        print("Error training brain model:", e)
        
    try:
        train_chest_xray_model()
    except Exception as e:
        print("Error training chest x-ray model:", e)
