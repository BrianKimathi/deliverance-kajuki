from extensions import db
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime

class Service(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    time = Column(String(50))
    day = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Service {self.name}>'

class ServiceTime(db.Model):
    id = Column(Integer, primary_key=True)
    service_id = Column(Integer, db.ForeignKey('service.id'), nullable=False)
    day = Column(String(20), nullable=False)  # Monday, Tuesday, etc.
    time = Column(String(10), nullable=False)  # HH:MM format
    label = Column(String(50))  # "First Service", "Second Service", etc.
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f'<ServiceTime {self.day} {self.time}>' 