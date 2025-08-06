from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin

announcement_bp = Blueprint('announcement_controller', __name__)

@announcement_bp.route('/', methods=['GET'])
def get_announcements():
    from models.announcement import Announcement
    announcements = Announcement.query.filter_by(is_active=True).order_by(Announcement.date.desc()).all()
    return jsonify([{
        'id': a.id,
        'title': a.title,
        'content': a.content,
        'date': a.date.isoformat() if a.date else None,
        'is_urgent': a.is_urgent,
        'is_active': a.is_active,
        'category': a.category,
        'created_at': a.created_at.isoformat() if a.created_at else None,
        'updated_at': a.updated_at.isoformat() if a.updated_at else None
    } for a in announcements])

@announcement_bp.route('/<int:announcement_id>', methods=['GET'])
@announcement_bp.route('/<int:announcement_id>/', methods=['GET'])
def get_announcement(announcement_id):
    from models.announcement import Announcement
    a = Announcement.query.get_or_404(announcement_id)
    return jsonify({
        'id': a.id,
        'title': a.title,
        'content': a.content,
        'date': a.date.isoformat() if a.date else None,
        'is_urgent': a.is_urgent,
        'is_active': a.is_active,
        'category': a.category,
        'created_at': a.created_at.isoformat() if a.created_at else None,
        'updated_at': a.updated_at.isoformat() if a.updated_at else None
    })

@announcement_bp.route('/', methods=['POST'])
@jwt_required()
def create_announcement():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.announcement import Announcement
    
    data = request.json
    a = Announcement(
        title=data['title'],
        content=data['content'],
        date=datetime.strptime(data['date'], '%Y-%m-%d') if data.get('date') else datetime.utcnow(),
        is_urgent=data.get('is_urgent', False),
        is_active=data.get('is_active', True),
        category=data.get('category', 'General')
    )
    db.session.add(a)
    db.session.commit()
    return jsonify({'msg': 'Announcement created', 'id': a.id})

@announcement_bp.route('/<int:announcement_id>', methods=['PUT'])
@announcement_bp.route('/<int:announcement_id>/', methods=['PUT'])
@jwt_required()
def update_announcement(announcement_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.announcement import Announcement
    a = Announcement.query.get_or_404(announcement_id)
    
    data = request.json
    a.title = data.get('title', a.title)
    a.content = data.get('content', a.content)
    a.date = datetime.strptime(data['date'], '%Y-%m-%d') if data.get('date') else a.date
    a.is_urgent = data.get('is_urgent', a.is_urgent)
    a.is_active = data.get('is_active', a.is_active)
    a.category = data.get('category', a.category)
    a.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Announcement updated'})

@announcement_bp.route('/<int:announcement_id>', methods=['DELETE'])
@announcement_bp.route('/<int:announcement_id>/', methods=['DELETE'])
@jwt_required()
def delete_announcement(announcement_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.announcement import Announcement
    a = Announcement.query.get_or_404(announcement_id)
    a.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Announcement deleted'}) 