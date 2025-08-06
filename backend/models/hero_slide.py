from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime

class HeroSlide(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    subtitle = Column(Text)
    image_url = Column(String(255), nullable=True)
    link_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    order_num = Column(Integer, default=0)  # For display order
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<HeroSlide {self.title}>' 