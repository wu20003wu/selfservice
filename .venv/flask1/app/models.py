from datetime import datetime
from app.extensions import db  # Import von extensions statt main

# SQLAlchemy-Klassen definieren (mit englischen Attributen)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(225), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    tasks = db.relationship("Task", back_populates="user")

class Type(db.Model):
    __tablename__ = 'types'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    tasks = db.relationship("Task", back_populates="type")

class Status(db.Model):
    __tablename__ = 'statuses'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)    
    tasks = db.relationship("Task", back_populates="status")

# Neue Task-Model-Klasse
class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now())
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id'))
    type_id = db.Column(db.Integer, db.ForeignKey('types.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.relationship("Status", back_populates="tasks")
    type = db.relationship("Type", back_populates="tasks")
    user = db.relationship("User", back_populates="tasks")

#sampleuser adden funktion insert sample data
def insert_sample_user():
    #sample user
    #only if no  any user exists
    if not User.query.first():
        user = User(username="wu2003wu@hotmail.com", password="123456")
        db.session.add(user)
        db.session.commit()

def insert_sample_status():
    #sample status
    #only if no  any status exists
    if not Status.query.first():
        status = Status(name="open")
        db.session.add(status)
        db.session.commit()

def insert_sample_type():
    #sample type
    #only if no  any type exists
    if not Type.query.first():
        type = Type(name="sample type")
        db.session.add(type)
        db.session.commit()

def insert_sample_task():
    #sample task
    #only if no  any task exists
    if not Task.query.first():
        task = Task(title="sample task", description="sample description", status_id=1, type_id=1, user_id=1)
        db.session.add(task)
        db.session.commit()
    
    
    

