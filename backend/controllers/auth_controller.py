from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from utils.utils import parse_jwt_identity

auth_bp = Blueprint('auth_controller', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    from models.user import User
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'msg': 'Username already exists'}), 400
    user = User(username=data['username'], email=f"{data['username']}@dciukajuki.org", is_admin=True)
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'Admin registered successfully'})

@auth_bp.route('/login', methods=['POST'])
def login():
    from models.user import User
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'msg': 'Invalid credentials'}), 401
    
    # Create identity string instead of object
    identity = f"{user.id}:{user.username}:{user.is_admin}"
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile information"""
    from models.user import User
    user_info = parse_jwt_identity()

    if not user_info:
        return jsonify({'msg': 'Invalid token format'}), 400

    user = User.query.get(user_info['id'])

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email or f"{user.username}@dciukajuki.org",
        'is_admin': user.is_admin,
        'active': user.active,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'last_login': user.last_login.isoformat() if user.last_login else None
    })

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile information"""
    from models.user import User
    user_info = parse_jwt_identity()

    if not user_info:
        return jsonify({'msg': 'Invalid token format'}), 400

    user = User.query.get(user_info['id'])

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    data = request.json

    # Update allowed fields
    if 'username' in data and data['username']:
        # Check if username is already taken by another user
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'msg': 'Username already exists'}), 400
        user.username = data['username']

    if 'email' in data and data['email']:
        # Check if email is already taken by another user
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'msg': 'Email already exists'}), 400
        user.email = data['email']

    # Update last login timestamp
    from datetime import datetime
    user.last_login = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({
            'msg': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email or f"{user.username}@dciukajuki.org",
                'is_admin': user.is_admin,
                'active': user.active,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error updating profile'}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify_token():
    """Verify if the current token is valid"""
    user_info = parse_jwt_identity()
    if not user_info:
        return jsonify({'msg': 'Invalid token format'}), 400
    
    return jsonify({
        'valid': True,
        'user': user_info
    }), 200 