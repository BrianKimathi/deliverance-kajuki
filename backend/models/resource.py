from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Numeric
from datetime import datetime

class Resource(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    description = Column(Text)
    category = Column(String(50))  # Spiritual Growth, Education, Ministry, etc.
    file_url = Column(String(255))  # URL to uploaded file
    is_paid = Column(Boolean, default=False)  # Whether resource is paid or free
    price = Column(Numeric(10, 2), default=0.0)  # Price in Ksh for paid resources
    status = Column(String(20), default='published')  # published, draft, archived
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Resource {self.title}>' 