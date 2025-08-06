#!/usr/bin/env python3
"""
Script to fix blueprint route decorators in all controller files
"""

import os
import re

def fix_blueprint_routes():
    controllers_dir = 'controllers'
    
    # Blueprint name mappings
    blueprint_mappings = {
        'event_controller.py': 'event_bp',
        'announcement_controller.py': 'announcement_bp',
        'sermon_controller.py': 'sermon_bp',
        'ministry_controller.py': 'ministry_bp',
        'devotional_controller.py': 'devotional_bp',
        'pastor_controller.py': 'pastor_bp',
        'resource_controller.py': 'resource_bp',
        'service_controller.py': 'service_bp',
        'church_info_controller.py': 'church_info_bp',
        'contact_controller.py': 'contact_bp',
        'giving_controller.py': 'giving_bp',
        'hero_slide_controller.py': 'hero_slide_bp'
    }
    
    for filename, blueprint_name in blueprint_mappings.items():
        filepath = os.path.join(controllers_dir, filename)
        if os.path.exists(filepath):
            print(f"Fixing {filename}...")
            
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Replace @bp.route with @{blueprint_name}.route
            content = re.sub(r'@bp\.route', f'@{blueprint_name}.route', content)
            
            with open(filepath, 'w') as f:
                f.write(content)
            
            print(f"✅ Fixed {filename}")

if __name__ == '__main__':
    print("🔧 Fixing blueprint route decorators...")
    fix_blueprint_routes()
    print("✅ All blueprint routes fixed!") 