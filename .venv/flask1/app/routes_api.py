from flask import Blueprint, jsonify, request
from datetime import datetime
from app.extensions import db  # Korrekter Import der DB-Instanz
from app.models import Task, Status, Type

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

@bp.route("/tasks", methods=['POST'])
def create_task():
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
        
    new_task = Task(
        title=data['title'],
        description=data.get('description', ''),
        status_id=data.get('status_id', 1),  # Default Open
        type_id=data.get('type_id', 1),
        created_at=datetime.utcnow()
    )
    
    try:
        db.session.add(new_task)
        db.session.commit()
        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'status': new_task.status.name if new_task.status else None,
            'created_at': new_task.created_at.isoformat()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.session.close()

@bp.route("/statuses", methods=['GET'])
def get_all_statuses():
    statuses = Status.query.all()
    return jsonify([{
        'id': s.id,
        'name': s.name
    } for s in statuses]), 200

@bp.route("/types", methods=['GET'])
def get_all_types():
    types = Type.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name
    } for t in types]), 200

