from flask import Blueprint, jsonify, request
from utils.auth import require_auth
from utils.config_service import get_config_data, save_config_data

config_bp = Blueprint('config_api', __name__, url_prefix='/api/config')

@config_bp.route('', methods=['GET'])
def get_config():
    return jsonify({"config": get_config_data()})

@config_bp.route('', methods=['POST'])
@require_auth
def update_config():
    result = save_config_data(request.json)

    if result["status"] == "conflict":
        return jsonify({
            "status": "conflict",
            "message": "Version obsolète — la config a été modifiée ailleurs.",
            "current": result["current"]
        }), 409

    return jsonify({"status": "success", "version": result["version"]}), 200