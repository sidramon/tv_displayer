from flask import request, jsonify, current_app
from functools import wraps
from utils.config_service import get_config_data
import bcrypt
import secrets

# Store en mémoire — sessions actives
active_tokens: set[str] = set()

def check_password(plain: str, stored: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), stored.encode())
    except Exception:
        return plain == stored

def generate_token() -> str:
    return secrets.token_hex(32)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('X-Admin-Token')
        if not token or token not in active_tokens:
            return jsonify({"status": "unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated