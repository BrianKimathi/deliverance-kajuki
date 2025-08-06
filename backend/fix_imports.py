#!/usr/bin/env python3
"""
Script to fix db imports in all controller files
"""

import os
import re

def fix_db_imports():
    controllers_dir = 'controllers'
    
    # Get all Python files in controllers directory
    for filename in os.listdir(controllers_dir):
        if filename.endswith('.py'):
            filepath = os.path.join(controllers_dir, filename)
            print(f"Fixing {filename}...")
            
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Replace 'from app import db' with 'from extensions import db'
            content = re.sub(r'from app import db', 'from extensions import db', content)
            
            with open(filepath, 'w') as f:
                f.write(content)
            
            print(f"✅ Fixed {filename}")

if __name__ == '__main__':
    print("🔧 Fixing db imports in controllers...")
    fix_db_imports()
    print("✅ All db imports fixed!") 