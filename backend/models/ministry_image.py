from extensions import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

class MinistryImage(db.Model):
    id = Column(Integer, primary_key=True)
    ministry_id = Column(Integer, ForeignKey('ministry.id'), nullable=False)
    image_url = Column(String(255), nullable=False)
    caption = Column(String(200))
    order = Column(Integer, default=0)  # For display order
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<MinistryImage {self.id} for ministry {self.ministry_id}>' 