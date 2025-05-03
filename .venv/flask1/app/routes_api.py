from flask import Blueprint, jsonify
from datetime import datetime
from app.extensions import db  # Korrekter Import der DB-Instanz
from app.models import Task

# Blueprint erstellen statt Flask-App
bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route("/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': "Hi, what's up?!",
        'people': ['kevin', 'kaize', 'wu']
    })

@bp.route("/tasks", methods=['GET'])
def get_all_tasks():
    tasks = Task.query.all()
    # Immer ein Array zurückgeben, auch wenn leer
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'created_at': t.created_at.isoformat() if t.created_at else None,
        'status': t.status.name if t.status else None,
        'type': t.type.name if t.type else None,
        'user': t.user.username if t.user else None
    } for t in tasks]), 200

