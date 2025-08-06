from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Date
from datetime import datetime

class Devotional(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    author = Column(String(100))
    date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Devotional {self.title}>' 