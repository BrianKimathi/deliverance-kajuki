#!/usr/bin/env python3

from app import create_app, db

def migrate_user_table():
    app = create_app()
    
    with app.app_context():
        try:
            # Add new columns to user table
            with db.engine.connect() as connection:
                # Check if columns exist first
                result = connection.execute(db.text("SHOW COLUMNS FROM user"))
                existing_columns = [row[0] for row in result.fetchall()]
                
                print("📋 Existing columns in user table:")
                for col in existing_columns:
                    print(f"   - {col}")
                
                # Add new columns if they don't exist
                if 'active' not in existing_columns:
                    connection.execute(db.text("ALTER TABLE user ADD COLUMN active BOOLEAN DEFAULT TRUE"))
                    print("✅ Added 'active' column")
                
                if 'created_at' not in existing_columns:
                    connection.execute(db.text("ALTER TABLE user ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"))
                    print("✅ Added 'created_at' column")
                
                if 'last_login' not in existing_columns:
                    connection.execute(db.text("ALTER TABLE user ADD COLUMN last_login DATETIME NULL"))
                    print("✅ Added 'last_login' column")
                
                connection.commit()
                print("✅ User table migration completed successfully!")
                
        except Exception as e:
            print(f"❌ Migration error: {e}")
            raise e

if __name__ == '__main__':
    print("🔧 Migrating user table...")
    migrate_user_table()
    print("✅ Migration completed!") 