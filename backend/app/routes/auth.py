# IMPORT SECTION
from flask import Blueprint, jsonify, request, current_app

# CONFIGURATION SECTION
auth_bp = Blueprint('auth_api', __name__, url_prefix='/api/auth')

# ROUTES SECTION
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    password = data.get('password') if data else None

    if password == current_app.config['ADMIN_PASSWORD']:
        return jsonify({"status": "success"}), 200

    return jsonify({"status": "unauthorized"}), 401