from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

class Ministry(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    long_description = Column(Text)
    image = Column(String(255))  # Main image
    leader = Column(String(120))
    contact_email = Column(String(120))
    contact_phone = Column(String(20))
    meeting_times = Column(Text)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)  # For display order
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    # cards = db.relationship('MinistryCard', backref='ministry', lazy=True, cascade='all, delete-orphan')
    images = db.relationship('MinistryImage', backref='ministry', lazy=True, cascade='all, delete-orphan', order_by='MinistryImage.order')

    def __repr__(self):
        return f'<Ministry {self.name}>' 