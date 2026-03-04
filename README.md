# TV Displayer

Système d'affichage dynamique pour écrans TV. Permet de gérer des playlists de médias (images et vidéos), des horaires planifiés, et de personnaliser l'interface selon l'entreprise.

## Prérequis

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/) — sur Windows : `choco install make` ou `winget install GnuWin32.Make`

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/sidramon/tv_displayer.git
cd tv_displayer
```

### 2. Configurer les variables d'environnement

Copie le fichier d'exemple et remplis les valeurs :

```bash
cp .env.example .env
```

| Variable         | Description                        | Exemple              |
|------------------|------------------------------------|----------------------|
| `SECRET_KEY`     | Clé secrète Flask                  | `une-cle-aleatoire`  |
| `ADMIN_PASSWORD` | Mot de passe de l'interface admin  | `motdepasse`         |
| `DATA_FILE`      | Chemin vers le fichier de config   | `/app/data/config.json` |
| `UPLOAD_FOLDER`  | Dossier des fichiers uploadés      | `/app/data/uploads`  |

## Lancement

### Développement

```bash
make dev
```

- Frontend disponible sur [http://localhost:3000](http://localhost:3000)
- Backend disponible sur [http://localhost:5000](http://localhost:5000)
- Hot reload activé sur le frontend et le backend
- Logs visibles dans le terminal

### Production

```bash
make prod
```

- Accessible sur [http://localhost](http://localhost) (port 80 via nginx)
- Frontend compilé et optimisé (`next build`)
- Backend servi par Gunicorn (4 workers)
- Conteneurs relancés automatiquement en cas d'erreur

### Arrêter les conteneurs

```bash
make down
```

## Structure du projet

```
tv_displayer/
├── frontend/          # Application Next.js
├── backend/           # API Flask
│   └── app/
│       ├── main.py
│       ├── routes/    # auth, config, upload
│       └── utils/     # auth, config_service, storage
├── docker/
│   ├── next/          # Dockerfile frontend
│   ├── python/        # Dockerfile backend
│   └── nginx/         # Configuration nginx
├── data/              # Données persistantes (config + uploads)
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Makefile
└── .env
```

## Utilisation

### Interface d'affichage (TV)

Ouvrir [http://localhost/display](http://localhost/display) sur l'écran TV.

Pour les écrans supplémentaires : [http://localhost/display/nom-ecran](http://localhost/display/nom-ecran)

### Interface d'administration

Ouvrir [http://localhost/admin](http://localhost/admin) et se connecter avec le mot de passe défini dans `.env`.

Fonctionnalités disponibles :
- Gestion des playlists par écran
- Planification par horaire (schedules)
- Upload d'images et vidéos avec recadrage
- Gestion de la musique de fond
- Paramètres de l'entreprise (nom, logo, thème)
- Changement de mot de passe

## Données persistantes

Les données sont stockées dans le dossier `data/` à la racine du projet :

```
data/
├── config.json    # Configuration complète
└── uploads/       # Médias uploadés
```

Ce dossier est monté en volume Docker — les données survivent aux redémarrages et rebuilds.