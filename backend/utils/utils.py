from flask_jwt_extended import get_jwt_identity

def parse_jwt_identity():
    """Parse the JWT identity string and return user info"""
    current_user = get_jwt_identity()
    print(f"🔍 DEBUG: Raw JWT identity: {current_user}")
    try:
        user_id, username, is_admin = current_user.split(':')
        result = {
            'id': int(user_id),
            'username': username,
            'is_admin': is_admin.lower() == 'true'
        }
        print(f"🔍 DEBUG: Parsed JWT identity: {result}")
        return result
    except (ValueError, AttributeError) as e:
        print(f"❌ ERROR: Failed to parse JWT identity: {str(e)}")
        return None

def is_admin():
    """Check if current user is admin"""
    print(f"🔍 DEBUG: Checking if user is admin")
    user_info = parse_jwt_identity()
    print(f"🔍 DEBUG: Parsed JWT identity: {user_info}")
    is_admin_user = user_info and user_info.get('is_admin', False)
    print(f"🔍 DEBUG: Is admin: {is_admin_user}")
    return is_admin_user 