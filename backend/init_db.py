from app import create_app, db
from models import *

def init_database():
    """Initialize the database with all tables"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # You can add initial data here if needed
        print("✅ Database initialization complete!")

if __name__ == '__main__':
    init_database() 