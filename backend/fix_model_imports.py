#!/usr/bin/env python3
"""
Script to fix db imports in all model files
"""

import os
import re

def fix_model_imports():
    models_dir = 'models'
    
    # Get all Python files in models directory
    for filename in os.listdir(models_dir):
        if filename.endswith('.py'):
            filepath = os.path.join(models_dir, filename)
            print(f"Fixing {filename}...")
            
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Replace 'from app import db' with 'from extensions import db'
            content = re.sub(r'from app import db', 'from extensions import db', content)
            
            with open(filepath, 'w') as f:
                f.write(content)
            
            print(f"✅ Fixed {filename}")

if __name__ == '__main__':
    print("🔧 Fixing db imports in models...")
    fix_model_imports()
    print("✅ All model imports fixed!") 