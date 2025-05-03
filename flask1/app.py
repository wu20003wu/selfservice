from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
import os
import secrets
from datetime import timedelta, datetime
from app.extensions import db  # ← Import von extensions
from app.routes import routes_ath, routes_api, routes_adm

# App-Instanz erstellen
app = Flask(__name__, instance_relative_config=True)
CORS(app)  # CORS aktivieren, um Anfragen vom Frontend zu erlauben
app.config.from_pyfile('config')  # from instance\

# Stelle sicher, dass der instance-Ordner existiert
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

# JWT initialisieren
jwt = JWTManager(app)

for routes in (routes_ath, routes_api, routes_adm):
    app.register_blueprint(routes.bp)

# DB initialisieren
db.init_app(app)

# ERST NACH DB-Initialisierung die Models importieren
from app.models import insert_sample_user, insert_sample_status, insert_sample_type, insert_sample_task

# Datenbanktabellen und Testdaten erstellen (innerhalb des App-Kontexts)
with app.app_context():
    db.create_all()
    insert_sample_user()
    insert_sample_status()
    insert_sample_type()
    insert_sample_task()

# Flask-Server starten
if __name__ == '__main__':
    app.run(debug=True, port=5000)
