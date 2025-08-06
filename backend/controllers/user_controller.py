from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from datetime import datetime

user_bp = Blueprint('user_controller', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    from models.user import User
    """Get all users"""
    try:
        users = User.query.all()
        user_list = []
        for user in users:
            user_list.append({
                'id': user.id,
                'name': user.username,  # Using username as name for admin interface
                'email': f"{user.username}@dciukajuki.org",  # Generate email from username
                'role': 'admin' if user.is_admin else 'editor',
                'status': 'active' if user.active else 'inactive',
                'lastLogin': user.last_login.strftime('%Y-%m-%d') if user.last_login else None
            })
        return jsonify({'users': user_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/', methods=['POST'])
@jwt_required()
def create_user():
    from models.user import User
    """Create a new user"""
    try:
        data = request.json
        
        # Extract username from name field
        username = data.get('name', data.get('username', ''))
        if not username:
            return jsonify({'error': 'Name/username is required'}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        # Determine role from admin interface
        is_admin = data.get('role') == 'admin'
        
        # Create new user
        user = User(
            username=username,
            is_admin=is_admin,
            active=data.get('status') == 'active'
        )
        user.set_password(data.get('password', 'password123'))  # Default password
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'name': user.username,
                'email': f"{user.username}@dciukajuki.org",
                'role': 'admin' if user.is_admin else 'editor',
                'status': 'active' if user.active else 'inactive',
                'lastLogin': user.last_login.strftime('%Y-%m-%d') if user.last_login else None
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@user_bp.route('/users/<int:user_id>/', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    from models.user import User
    """Update a user"""
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        
        # Update user fields
        if 'name' in data:
            # Check if new username already exists
            existing_user = User.query.filter_by(username=data['name']).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({'error': 'Username already exists'}), 400
            user.username = data['name']
        
        if 'role' in data:
            user.is_admin = data['role'] == 'admin'
        
        if 'status' in data:
            user.active = data['status'] == 'active'
        
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'name': user.username,
                'email': f"{user.username}@dciukajuki.org",
                'role': 'admin' if user.is_admin else 'editor',
                'status': 'active' if user.active else 'inactive',
                'lastLogin': user.last_login.strftime('%Y-%m-%d') if user.last_login else None
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@user_bp.route('/users/<int:user_id>/', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    from models.user import User
    """Delete a user"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Prevent deleting the last admin user
        if user.is_admin:
            admin_count = User.query.filter_by(is_admin=True).count()
            if admin_count <= 1:
                return jsonify({'error': 'Cannot delete the last admin user'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>/status', methods=['PUT'])
@jwt_required()
def toggle_user_status(user_id):
    from models.user import User
    """Toggle user active status"""
    try:
        user = User.query.get_or_404(user_id)
        
        user.active = not user.active
        
        db.session.commit()
        
        return jsonify({
            'message': 'User status updated successfully',
            'user': {
                'id': user.id,
                'name': user.username,
                'email': f"{user.username}@dciukajuki.org",
                'role': 'admin' if user.is_admin else 'editor',
                'status': 'active' if user.active else 'inactive',
                'lastLogin': user.last_login.strftime('%Y-%m-%d') if user.last_login else None
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 