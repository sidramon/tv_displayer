from flask import request, jsonify, current_app
from functools import wraps
import bcrypt
import secrets
import json
import os

def _get_tokens_file() -> str:
    data_file = current_app.config['DATA_FILE']
    return os.path.join(os.path.dirname(data_file), 'tokens.json')

def _load_tokens() -> set:
    try:
        path = _get_tokens_file()
        if not os.path.exists(path):
            return set()
        with open(path, 'r') as f:
            return set(json.load(f))
    except Exception:
        return set()

def _save_tokens(tokens: set) -> None:
    try:
        with open(_get_tokens_file(), 'w') as f:
            json.dump(list(tokens), f)
    except Exception:
        pass

def check_password(plain: str, stored: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), stored.encode())
    except Exception:
        return plain == stored

def generate_token() -> str:
    return secrets.token_hex(32)

def add_token(token: str) -> None:
    tokens = _load_tokens()
    tokens.add(token)
    _save_tokens(tokens)

def remove_token(token: str) -> None:
    tokens = _load_tokens()
    tokens.discard(token)
    _save_tokens(tokens)

def is_valid_token(token: str) -> bool:
    return token in _load_tokens()

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('X-Admin-Token')
        if not token or not is_valid_token(token):
            return jsonify({"status": "unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated