from flask import Blueprint, jsonify, request
from datetime import datetime

from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from app.extensions import db  # Korrekter Import der DB-Instanz
from app.models import User, Type, Status, Task

# Blueprint erstellen statt Flask-App
bp = Blueprint('adm', __name__, url_prefix='')

# Dekorator zur Überprüfung, ob ein Benutzer ein Admin ist

@bp.route("/adm", methods=["GET"])
@jwt_required()
def adm_route():
    claims = get_jwt()
    if claims.get("is_admin"):
        return "Admin-Bereich!"
    else:
        return "Keine Berechtigung", 403
    
@bp.route("/adm/users", methods=['GET'])
def get_all_users():
    users = User.query.all()
    
    user_list = [
        {
            "id": user.id,
            "name": user.name,
            "password": user.password
        }
        for user in users
    ]

    return jsonify(types=user_list), 200

@bp.route("/adm/signup", methods=['POST'])
@jwt_required()  # Stelle sicher, dass ein JWT-Token benötigt wird
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Prüfen ob Benutzer bereits existiert
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"msg": "Benutzername bereits vergeben"}), 409

    # Neuen Benutzer erstellen
    new_user = User(username=username, password=password)
        
    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Direkt einen Token erstellen für Auto-Login
        access_token = create_access_token(identity=username)
        return jsonify({
            "msg": "Registrierung erfolgreich",
            "access_token": access_token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Fehler bei der Registrierung"}), 500