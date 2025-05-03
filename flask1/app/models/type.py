from datetime import datetime
from app.extensions import db  # Import von extensions statt main

class Type(db.Model):
    __tablename__ = 'types'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    tasks = db.relationship("Task", back_populates="type")

def insert_sample_type():
    #sample type
    #only if no  any type exists
    if not Type.query.first():
        type = Type(name="sample type")
        db.session.add(type)
        db.session.commit()

    
    

