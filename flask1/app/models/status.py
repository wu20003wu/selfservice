from datetime import datetime
from app.extensions import db  # Import von extensions statt main

class Status(db.Model):
    __tablename__ = 'statuses'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)    
    tasks = db.relationship("Task", back_populates="status")

def insert_sample_status():
    #sample status
    #only if no  any status exists
    if not Status.query.first():
        status = Status(name="open")
        db.session.add(status)
        db.session.commit()
    
    

