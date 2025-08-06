from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

class ChurchMember(db.Model):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(120), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    address = Column(Text, nullable=True)
    gender = Column(String(10), nullable=True)  # Male, Female, Other
    marital_status = Column(String(20), nullable=True)  # Single, Married, Divorced, Widowed
    baptism_date = Column(DateTime, nullable=True)
    membership_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    ministry_assignments = relationship('MemberMinistry', back_populates='member', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<ChurchMember {self.first_name} {self.last_name}>'

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class MemberMinistry(db.Model):
    id = Column(Integer, primary_key=True)
    member_id = Column(Integer, ForeignKey('church_member.id'), nullable=False)
    ministry_id = Column(Integer, ForeignKey('ministry.id'), nullable=False)
    role = Column(String(50), nullable=True)  # Leader, Member, Coordinator, etc.
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    member = relationship('ChurchMember', back_populates='ministry_assignments')
    ministry = relationship('Ministry')

    def __repr__(self):
        return f'<MemberMinistry {self.member.full_name} - {self.ministry.name}>' 