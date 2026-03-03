# IMPORT SECTION
import os
import json
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

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

    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    data_dir = os.path.dirname(app.config['DATA_FILE'])
    if not os.path.exists(data_dir) and data_dir != '':
        os.makedirs(data_dir, exist_ok=True)

    if not os.path.exists(app.config['DATA_FILE']):
        default_config = {
            "displays": {
                "default": {
                    "settings": {
                        "slideDuration": 8000,
                        "rotationLength": 2,
                        "rotationReferenceDate": "2024-01-07"
                    },
                    "default": {"items": [], "audio": ""},
                    "schedules": {},
                    "rotations": {
                        "1": {"items": [], "audio": ""},
                        "2": {"items": [], "audio": ""}
                    }
                }
            }
        }
        with open(app.config['DATA_FILE'], 'w') as f:
            json.dump(default_config, f)

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