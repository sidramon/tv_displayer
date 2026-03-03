# IMPORT SECTION
from flask import Blueprint, jsonify, request
from utils.auth import require_auth
from utils.config_service import get_config_data, save_config_data

# CONFIGURATION SECTION
config_bp = Blueprint('config_api', __name__, url_prefix='/api/config')

# ROUTES SECTION
@config_bp.route('', methods=['GET'])
def get_config():
    return jsonify({"config": get_config_data()})

@config_bp.route('', methods=['POST'])
@require_auth
def update_config():
    save_config_data(request.json)
    return jsonify({"status": "success"}), 200