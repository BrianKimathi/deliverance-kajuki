from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

class MinistryCard(db.Model):
    id = Column(Integer, primary_key=True)
    ministry_id = Column(Integer, db.ForeignKey('ministry.id'), nullable=False)
    title = Column(String(120), nullable=False)
    description = Column(Text)
    image = Column(String(255))
    order_num = Column(Integer, default=0)  # For display order
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<MinistryCard {self.title}>' 