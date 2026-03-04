# IMPORT SECTION
from flask import Blueprint, jsonify, request, current_app
import os
from utils.auth import require_auth

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

@auth_bp.route('/change-password', methods=['POST'])
@require_auth
def change_password():
    data = request.json
    new_password = data.get('newPassword') if data else None

    if not new_password or len(new_password) < 4:
        return jsonify({"status": "error", "message": "Mot de passe invalide"}), 400

    env_path = os.path.join(current_app.root_path, '..', '.env')

    try:
        with open(env_path, 'r') as f:
            lines = f.readlines()

        with open(env_path, 'w') as f:
            updated = False
            for line in lines:
                if line.startswith('ADMIN_PASSWORD='):
                    f.write(f'ADMIN_PASSWORD={new_password}\n')
                    updated = True
                else:
                    f.write(line)
            if not updated:
                f.write(f'ADMIN_PASSWORD={new_password}\n')

    except FileNotFoundError:
        pass

    current_app.config['ADMIN_PASSWORD'] = new_password
    return jsonify({"status": "success"}), 200