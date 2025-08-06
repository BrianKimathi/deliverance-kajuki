from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import parse_jwt_identity

giving_bp = Blueprint('giving_controller', __name__)

@giving_bp.route('/', methods=['GET'])
def get_giving_methods():
    """Public endpoint to get giving methods without authentication"""
    from models.giving import Giving
    methods = Giving.query.filter_by(is_active=True).all()
    
    return jsonify([{
        'id': method.id,
        'title': method.title,
        'description': method.description,
        'is_active': method.is_active,
        'created_at': method.created_at.isoformat() if method.created_at else None,
        'updated_at': method.updated_at.isoformat() if method.updated_at else None
    } for method in methods])

@giving_bp.route('/admin', methods=['GET'])
@jwt_required()
def get_giving_methods_admin():
    """Admin endpoint to get all giving methods as array"""
    from models.giving import Giving
    from utils.utils import is_admin
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    methods = Giving.query.all()
    return jsonify([{
        'id': method.id,
        'title': method.title,
        'description': method.description,
        'is_active': method.is_active,
        'created_at': method.created_at.isoformat() if method.created_at else None,
        'updated_at': method.updated_at.isoformat() if method.updated_at else None
    } for method in methods])

@giving_bp.route('/<int:method_id>', methods=['GET'])
@giving_bp.route('/<int:method_id>/', methods=['GET'])
def get_giving_method(method_id):
    """Public endpoint to get a single giving method without authentication"""
    from models.giving import Giving
    method = Giving.query.get_or_404(method_id)
    
    return jsonify({
        'id': method.id,
        'title': method.title,
        'description': method.description,
        'is_active': method.is_active,
        'created_at': method.created_at.isoformat() if method.created_at else None,
        'updated_at': method.updated_at.isoformat() if method.updated_at else None
    })

@giving_bp.route('/', methods=['POST'])
@jwt_required()
def create_giving_method():
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.giving import Giving
    data = request.json
    method = Giving(
        title=data.get('title', ''),
        description=data.get('description', ''),
        is_active=data.get('is_active', True)
    )
    db.session.add(method)
    db.session.commit()
    return jsonify({'msg': 'Giving method created', 'id': method.id})

@giving_bp.route('/<int:method_id>', methods=['PUT'])
@giving_bp.route('/<int:method_id>/', methods=['PUT'])
@jwt_required()
def update_giving_method(method_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.giving import Giving
    method = Giving.query.get_or_404(method_id)
    data = request.json
    
    method.title = data.get('title', method.title)
    method.description = data.get('description', method.description)
    method.is_active = data.get('is_active', method.is_active)
    method.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Giving method updated'})

@giving_bp.route('/<int:method_id>', methods=['DELETE'])
@giving_bp.route('/<int:method_id>/', methods=['DELETE'])
@jwt_required()
def delete_giving_method(method_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.giving import Giving
    method = Giving.query.get_or_404(method_id)
    method.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Giving method deleted'}) 