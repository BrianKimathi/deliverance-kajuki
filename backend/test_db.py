#!/usr/bin/env python3

from app import create_app, db
from models.user import User
from werkzeug.security import generate_password_hash

def test_database():
    app = create_app()
    
    with app.app_context():
        try:
            # Create tables
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Check if admin user exists
            admin_user = User.query.filter_by(username='admin').first()
            
            if not admin_user:
                # Create admin user
                admin_user = User(
                    username='admin',
                    is_admin=True,
                    active=True
                )
                admin_user.set_password('admin123')
                db.session.add(admin_user)
                db.session.commit()
                print("✅ Admin user created successfully!")
                print("   Username: admin")
                print("   Password: admin123")
            else:
                print("✅ Admin user already exists!")
            
            # List all users
            users = User.query.all()
            print(f"📊 Total users in database: {len(users)}")
            for user in users:
                print(f"   - {user.username} (Admin: {user.is_admin}, Active: {user.active})")
                
        except Exception as e:
            print(f"❌ Error: {e}")
            raise e

if __name__ == '__main__':
    print("🔧 Testing database setup...")
    test_database()
    print("✅ Database test completed!") 