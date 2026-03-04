# IMPORT SECTION
import os
import json
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from utils.storage import ensure_directories, ensure_default_config
from utils.default_config import DEFAULT_CONFIG
from utils.auth import require_auth

# INITIALIZATION SECTION
load_dotenv()

# CONFIGURATION SECTION
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
    DATA_FILE = os.environ.get('DATA_FILE', '/app/data/config.json')
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', '/app/data/uploads')

# APP CREATION SECTION
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    ensure_directories(app.config['UPLOAD_FOLDER'], app.config['DATA_FILE'])
    ensure_default_config(app.config['DATA_FILE'], DEFAULT_CONFIG)

    with app.app_context():
        from routes.config import config_bp
        from routes.upload import upload_bp
        from routes.auth import auth_bp
        app.register_blueprint(config_bp)
        app.register_blueprint(upload_bp)
        app.register_blueprint(auth_bp)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)