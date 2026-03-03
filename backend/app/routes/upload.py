# IMPORT SECTION
from flask import Blueprint, jsonify, request, current_app
import os
import uuid

# CONFIGURATION SECTION
upload_bp = Blueprint('upload_api', __name__, url_prefix='/api/upload')

# ROUTES SECTION
@upload_bp.route('', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "Aucun fichier"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"status": "error", "message": "Fichier vide"}), 400

    upload_folder = current_app.config['UPLOAD_FOLDER']
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'bin'
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    return jsonify({
        "status": "success",
        "url": f"/uploads/{filename}",
        "type": ext
    }), 200

@upload_bp.route('/<filename>', methods=['DELETE'])
def delete_upload(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    filepath = os.path.join(upload_folder, filename)

    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({"status": "success"}), 200

    return jsonify({"status": "not_found"}), 404