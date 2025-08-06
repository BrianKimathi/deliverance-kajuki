from extensions import db
from sqlalchemy import Column, Integer, String, Text, Date

class Sermon(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    date = Column(Date, nullable=False)
    speaker = Column(String(120), nullable=False)
    youtube_url = Column(String(255))
    description = Column(Text)

    def __repr__(self):
        return f'<Sermon {self.title}>' 