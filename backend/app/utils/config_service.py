import json
import time
from flask import current_app

def get_config_data() -> dict:
    with open(current_app.config['DATA_FILE'], 'r') as f:
        return json.load(f)

def save_config_data(data: dict) -> dict:
    """
    Retourne {"status": "success"} ou {"status": "conflict", "current": <config actuelle>}.
    """
    filepath = current_app.config['DATA_FILE']

    with open(filepath, 'r') as f:
        current = json.load(f)

    incoming_version = data.get("version", 0)
    current_version  = current.get("version", 0)

    if incoming_version < current_version:
        # La version entrante est obsolète — on refuse l'écrasement
        return {"status": "conflict", "current": current}

    # Tampon la nouvelle version avant d'écrire
    data["version"] = time.time()

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    return {"status": "success", "version": data["version"]}