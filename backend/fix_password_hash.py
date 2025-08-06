#!/usr/bin/env python3

from app import create_app, db

def fix_password_hash_column():
    app = create_app()
    
    with app.app_context():
        try:
            with db.engine.connect() as connection:
                # Alter the password_hash column to be longer
                connection.execute(db.text("ALTER TABLE user MODIFY COLUMN password_hash VARCHAR(255)"))
                connection.commit()
                print("✅ Fixed password_hash column size!")
                
        except Exception as e:
            print(f"❌ Error fixing password_hash column: {e}")
            raise e

if __name__ == '__main__':
    print("🔧 Fixing password_hash column...")
    fix_password_hash_column()
    print("✅ Password hash column fixed!") 