from extensions import db
from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, Boolean
from datetime import datetime

class GivingTransaction(db.Model):
    id = Column(Integer, primary_key=True)
    donor_name = Column(String(120), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)  # Amount in Ksh
    payment_method = Column(String(50), nullable=False)  # M-Pesa, Bank, Cash, etc.
    reference_number = Column(String(50))  # Transaction reference
    phone_number = Column(String(20))  # For M-Pesa transactions
    purpose = Column(String(200))  # Tithe, Offering, Project, etc.
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<GivingTransaction {self.donor_name} - Ksh {self.amount}>' 