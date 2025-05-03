from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
import jwt
import datetime
from app.models import User

bp = Blueprint('ath', __name__, url_prefix='')

@bp.route('/ath/login', methods=['POST'])
def login():
    auth = request.get_json()
    username = auth['username']
    password = auth['password']

    user = User.query.filter_by(username=username, password=password).first()

    if user:
        additional_claims = {"is_admin": user.is_admin}
        access_token = create_access_token(identity=user.username, additional_claims=additional_claims)
        return jsonify(access_token=access_token, username=user.username), 200
    else:
        return jsonify({"msg": "Invalid credentials"}), 401


# Geschützte Route: Nur mit gültigem JWT-Token aufrufbar
@bp.route("/ath/protected", methods=['GET'])
@jwt_required()
def protected():
    # Der aktuelle Benutzer wird aus dem Token abgerufen
    current_user = get_jwt_identity()
    claims = get_jwt()
    return jsonify(logged_in_as=current_user, is_admin=claims.get("is_admin"), msg="Welcome to the protected route!"), 200