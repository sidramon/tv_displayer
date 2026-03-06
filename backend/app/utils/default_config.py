# app/data/default_config.py
DEFAULT_CONFIG = {
"settings": {
        "companyName": "",
        "logoUrl": "",
        "theme": "light",
        "weatherLatitude": 0,
        "weatherLongitude": 0,
        "locale": "fr",
    },
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