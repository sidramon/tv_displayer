from flask import Blueprint, jsonify, request, current_app
import bcrypt
from utils.auth import require_auth, check_password, generate_token, add_token, remove_token
from utils.config_service import get_config_data, save_config_data

auth_bp = Blueprint('auth_api', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    password = data.get('password') if data else None
    if not password:
        return jsonify({"status": "unauthorized"}), 401

    config = get_config_data()
    stored = config.get('settings', {}).get('adminPassword') or None
    if not stored:
        stored = current_app.config['ADMIN_PASSWORD']

    if not check_password(password, stored):
        return jsonify({"status": "unauthorized"}), 401

    # Migre mot de passe en clair vers bcrypt
    if not stored.startswith('$2b$'):
        hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        config.setdefault('settings', {})['adminPassword'] = hashed
        save_config_data(config)

    token = generate_token()
    add_token(token)
    return jsonify({"status": "success", "token": token}), 200

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    token = request.headers.get('X-Admin-Token')
    remove_token(token)
    return jsonify({"status": "success"}), 200

@auth_bp.route('/change-password', methods=['POST'])
@require_auth
def change_password():
    data = request.json
    new_password = data.get('newPassword') if data else None

    if not new_password or len(new_password) < 4:
        return jsonify({"status": "error", "message": "Mot de passe invalide"}), 400

    hashed = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
    config = get_config_data()
    config.setdefault('settings', {})['adminPassword'] = hashed
    save_config_data(config)

    return jsonify({"status": "success"}), 200

@auth_bp.route('/verify', methods=['GET'])
@require_auth
def verify():
    return jsonify({"status": "valid"}), 200