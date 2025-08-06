#!/usr/bin/env python3
"""
Database Setup Script for Deliverance Church Website
This script helps set up the MySQL database for the project.
"""

import subprocess
import sys
import os
from app import create_app, db

def check_mysql_installation():
    """Check if MySQL is installed and running"""
    try:
        result = subprocess.run(['mysql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ MySQL is installed")
            return True
        else:
            print("❌ MySQL is not installed or not accessible")
            return False
    except FileNotFoundError:
        print("❌ MySQL is not installed")
        return False

def install_mysql():
    """Install MySQL on Ubuntu/Debian systems"""
    print("📦 Installing MySQL...")
    try:
        # Update package list
        subprocess.run(['sudo', 'apt', 'update'], check=True)
        
        # Install MySQL server
        subprocess.run(['sudo', 'apt', 'install', '-y', 'mysql-server'], check=True)
        
        # Start MySQL service
        subprocess.run(['sudo', 'systemctl', 'start', 'mysql'], check=True)
        subprocess.run(['sudo', 'systemctl', 'enable', 'mysql'], check=True)
        
        print("✅ MySQL installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install MySQL: {e}")
        return False

def setup_database():
    """Set up the database and user"""
    print("🔧 Setting up database...")
    
    # Create database and user
    mysql_commands = [
        "CREATE DATABASE IF NOT EXISTS dciukajuki;",
        "CREATE USER IF NOT EXISTS 'dciukajuki_user'@'localhost' IDENTIFIED BY 'dciukajuki_password';",
        "GRANT ALL PRIVILEGES ON dciukajuki.* TO 'dciukajuki_user'@'localhost';",
        "FLUSH PRIVILEGES;"
    ]
    
    try:
        # Run MySQL commands as root
        for command in mysql_commands:
            subprocess.run(['sudo', 'mysql', '-e', command], check=True)
        
        print("✅ Database and user created successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to set up database: {e}")
        return False

def create_tables():
    """Create all database tables"""
    print("📋 Creating database tables...")
    
    app = create_app()
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created successfully!")
            return True
        except Exception as e:
            print(f"❌ Failed to create tables: {e}")
            return False

def update_config():
    """Update the database configuration"""
    print("⚙️ Updating database configuration...")
    
    # Create .env file with database credentials
    env_content = """# Database Configuration
DATABASE_URL=mysql://dciukajuki_user:dciukajuki_password@localhost/dciukajuki

# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production

# Flask Settings
FLASK_ENV=development
FLASK_DEBUG=1
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Configuration file created!")
        return True
    except Exception as e:
        print(f"❌ Failed to create configuration: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Starting MySQL Database Setup for Deliverance Church Website")
    print("=" * 60)
    
    # Check if MySQL is installed
    if not check_mysql_installation():
        print("\n📦 MySQL not found. Installing...")
        if not install_mysql():
            print("❌ Failed to install MySQL. Please install it manually.")
            sys.exit(1)
    
    # Set up database
    if not setup_database():
        print("❌ Failed to set up database.")
        sys.exit(1)
    
    # Update configuration
    if not update_config():
        print("❌ Failed to update configuration.")
        sys.exit(1)
    
    # Create tables
    if not create_tables():
        print("❌ Failed to create tables.")
        sys.exit(1)
    
    print("\n🎉 Database setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Install Python dependencies: pip install -r requirements.txt")
    print("2. Run the Flask application: python app.py")
    print("3. Access the API at: http://localhost:5000")

if __name__ == '__main__':
    main() 