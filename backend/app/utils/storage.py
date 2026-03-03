# app/utils/storage.py
import os
import json

def ensure_directories(upload_folder: str, data_file: str):
    os.makedirs(upload_folder, exist_ok=True)
    data_dir = os.path.dirname(data_file)
    if data_dir:
        os.makedirs(data_dir, exist_ok=True)

def ensure_default_config(data_file: str, default_config: dict):
    if not os.path.exists(data_file):
        with open(data_file, 'w') as f:
            json.dump(default_config, f)