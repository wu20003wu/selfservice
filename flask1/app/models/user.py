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

#sampleuser adden funktion insert sample data
def insert_sample_user():
    #sample user
    #only if no  any user exists
    if not User.query.first():
        user = User(username="wu2003wu@hotmail.com", password="123456")
        db.session.add(user)
        db.session.commit()

    
    

