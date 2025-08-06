from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import parse_jwt_identity

devotional_bp = Blueprint('devotional_controller', __name__)

@devotional_bp.route('/', methods=['GET'])
def get_devotionals():
    """Public endpoint to get devotionals without authentication"""
    from models.devotional import Devotional
    devotionals = Devotional.query.filter_by(is_active=True).order_by(Devotional.date.desc()).all()
    return jsonify([{
        'id': d.id,
        'title': d.title,
        'content': d.content,
        'author': d.author,
        'date': d.date.isoformat() if d.date else None,
        'is_active': d.is_active,
        'created_at': d.created_at.isoformat() if d.created_at else None,
        'updated_at': d.updated_at.isoformat() if d.updated_at else None
    } for d in devotionals])

@devotional_bp.route('/<int:devotional_id>', methods=['GET'])
@devotional_bp.route('/<int:devotional_id>/', methods=['GET'])
def get_devotional(devotional_id):
    """Public endpoint to get a single devotional without authentication"""
    from models.devotional import Devotional
    devotional = Devotional.query.get_or_404(devotional_id)
    return jsonify({
        'id': devotional.id,
        'title': devotional.title,
        'content': devotional.content,
        'author': devotional.author,
        'date': devotional.date.isoformat() if devotional.date else None,
        'is_active': devotional.is_active,
        'created_at': devotional.created_at.isoformat() if devotional.created_at else None,
        'updated_at': devotional.updated_at.isoformat() if devotional.updated_at else None
    })

@devotional_bp.route('/', methods=['POST'])
@jwt_required()
def create_devotional():
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.devotional import Devotional
    data = request.json
    devotional = Devotional(
        title=data['title'],
        content=data.get('content', ''),
        author=data.get('author', ''),
        date=datetime.strptime(data['date'], '%Y-%m-%d').date() if data.get('date') else None,
        is_active=data.get('is_active', True)
    )
    db.session.add(devotional)
    db.session.commit()
    return jsonify({'msg': 'Devotional created', 'id': devotional.id})

@devotional_bp.route('/<int:devotional_id>', methods=['PUT'])
@devotional_bp.route('/<int:devotional_id>/', methods=['PUT'])
@jwt_required()
def update_devotional(devotional_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.devotional import Devotional
    devotional = Devotional.query.get_or_404(devotional_id)
    data = request.json
    
    devotional.title = data.get('title', devotional.title)
    devotional.content = data.get('content', devotional.content)
    devotional.author = data.get('author', devotional.author)
    devotional.date = datetime.strptime(data['date'], '%Y-%m-%d').date() if data.get('date') else devotional.date
    devotional.is_active = data.get('is_active', devotional.is_active)
    devotional.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Devotional updated'})

@devotional_bp.route('/<int:devotional_id>', methods=['DELETE'])
@devotional_bp.route('/<int:devotional_id>/', methods=['DELETE'])
@jwt_required()
def delete_devotional(devotional_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.devotional import Devotional
    devotional = Devotional.query.get_or_404(devotional_id)
    devotional.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Devotional deleted'}) 