from extensions import db
from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Text, Boolean
from sqlalchemy.dialects.mysql import JSON
from datetime import datetime

class FormSubmission(db.Model):
    id = Column(Integer, primary_key=True)
    form_type = Column(String(50), nullable=False)  # 'contact', 'prayer_request', 'pastoral_care', etc.
    name = Column(String(100))
    email = Column(String(120))
    phone = Column(String(20))
    message = Column(Text)
    additional_data = Column(JSON)  # For storing additional form data
    resource_id = Column(Integer, ForeignKey('resource.id'), nullable=True)  # Optional, for resource submissions
    data = Column(JSON, nullable=True)  # Optional, for resource submissions
    is_read = Column(Boolean, default=False)  # Track if admin has read the submission
    timestamp = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<FormSubmission {self.id} - {self.form_type}>' 