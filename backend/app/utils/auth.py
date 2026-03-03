# app/utils/auth.py
from flask import request, jsonify, current_app
from functools import wraps

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('X-Admin-Token')
        if token != current_app.config['ADMIN_PASSWORD']:
            return jsonify({"status": "unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated