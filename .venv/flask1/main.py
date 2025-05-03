from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
import os
import secrets
from datetime import timedelta
from datetime import datetime
import config  # Neu hinzugefügter Import
from app.extensions import db  # ← Import von extensions
from app.routes_adm import bp as bp_adm
from app.routes_api import bp as bp_api
from app.routes_ath import bp as bp_ath

# App-Instanz erstellen
app = Flask(__name__)
CORS(app)  # CORS aktivieren, um Anfragen vom Frontend zu erlauben
app.config.from_object(config)  # Konfiguration aus config.py laden

# DB initialisieren
db.init_app(app)

# JWT initialisieren
jwt = JWTManager(app)

# ERST NACH DB-Initialisierung die Models importieren
from app.models import insert_sample_user, insert_sample_status, insert_sample_type, insert_sample_task

# Datenbanktabellen und Testdaten erstellen (innerhalb des App-Kontexts)
with app.app_context():
    db.create_all()
    insert_sample_user()
    insert_sample_status()
    insert_sample_type()
    insert_sample_task()

for bp in (bp_api, bp_ath, bp_adm):
    app.register_blueprint(bp)

# Flask-Server starten
if __name__ == '__main__':
    app.run(debug=True, port=5000)
