from extensions import db
from sqlalchemy import Column, Integer, String, Text, Date, Time, Boolean

class Event(db.Model):
    id = Column(Integer, primary_key=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    image = Column(String(255))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    is_multiday = Column(Boolean, default=False)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    same_time_all_days = Column(Boolean, default=True)

    def __repr__(self):
        return f'<Event {self.title}>' 