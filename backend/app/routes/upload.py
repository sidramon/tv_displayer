# IMPORT SECTION
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from utils.auth import require_auth
import os
import uuid

# CONSTANTS SECTION
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'webm', 'mp3', 'wav'}

def allowed_extension(ext: str) -> bool:
    return ext in ALLOWED_EXTENSIONS

# CONFIGURATION SECTION
upload_bp = Blueprint('upload_api', __name__, url_prefix='/api/upload')

# ROUTES SECTION
@upload_bp.route('', methods=['POST'])
@require_auth
def upload_file():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "Aucun fichier"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"status": "error", "message": "Fichier vide"}), 400

    upload_folder = current_app.config['UPLOAD_FOLDER']

    ext = secure_filename(file.filename).rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
    if not allowed_extension(ext):
        return jsonify({"status": "error", "message": "Type de fichier non autorisé"}), 400

    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    return jsonify({
        "status": "success",
        "url": f"/uploads/{filename}",
        "type": ext
    }), 200

@upload_bp.route('/<filename>', methods=['DELETE'])
@require_auth
def delete_upload(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    filepath = os.path.join(upload_folder, filename)

    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({"status": "success"}), 200

    return jsonify({"status": "not_found"}), 404