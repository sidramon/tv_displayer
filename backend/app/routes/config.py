# IMPORT SECTION
from flask import Blueprint, jsonify, request, current_app
import json

# CONFIGURATION SECTION
config_bp = Blueprint('config_api', __name__, url_prefix='/api/config')

# HELPER SECTION
def get_config_data():
    with open(current_app.config['DATA_FILE'], 'r') as f:
        return json.load(f)

def save_config_data(data):
    with open(current_app.config['DATA_FILE'], 'w') as f:
        json.dump(data, f)

# ROUTES SECTION
@config_bp.route('', methods=['GET'])
def get_config():
    return jsonify({"config": get_config_data()})

@config_bp.route('', methods=['POST'])
def update_config():
    data = request.json
    save_config_data(data)
    return jsonify({"status": "success"}), 200