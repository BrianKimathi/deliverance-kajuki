from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

class ChurchInfo(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    address = Column(Text)
    phone = Column(String(20))
    email = Column(String(120))
    website = Column(String(120))
    vision = Column(Text)
    mission = Column(Text)
    about = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ChurchInfo {self.name}>' 