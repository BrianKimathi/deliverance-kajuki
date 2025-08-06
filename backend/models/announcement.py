from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

class Announcement(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    content = Column(Text, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    is_urgent = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    category = Column(String(50))  # General, Service, Event, Ministry, etc.
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Announcement {self.title}>' 