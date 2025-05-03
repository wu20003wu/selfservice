from datetime import datetime
from app.extensions import db  # Import von extensions statt main

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

def insert_sample_task():
    #sample task
    #only if no  any task exists
    if not Task.query.first():
        task = Task(title="sample task", description="sample description", status_id=1, type_id=1, user_id=1)
        db.session.add(task)
        db.session.commit()
    
    
    

