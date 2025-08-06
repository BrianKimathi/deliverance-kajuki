from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

class Giving(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Giving {self.title}>' 