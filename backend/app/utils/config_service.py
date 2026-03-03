# app/utils/config_service.py
import json
from flask import current_app

def get_config_data() -> dict:
    with open(current_app.config['DATA_FILE'], 'r') as f:
        return json.load(f)

def save_config_data(data: dict) -> None:
    with open(current_app.config['DATA_FILE'], 'w') as f:
        json.dump(data, f, indent=2)