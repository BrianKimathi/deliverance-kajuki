from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

class Pastor(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    title = Column(String(120), nullable=False)
    bio = Column(Text)
    extended_bio = Column(Text)
    image = Column(String(255))  # Photo URL
    email = Column(String(120))
    phone = Column(String(20))
    ministry_responsibilities = Column(Text)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Pastor {self.name} - {self.title}>' 