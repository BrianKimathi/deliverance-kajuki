from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin

church_info_bp = Blueprint('church_info_controller', __name__)

@church_info_bp.route('/', methods=['GET'])
def get_church_info():
    from models.church_info import ChurchInfo
    church_info = ChurchInfo.query.first()
    if church_info:
        return jsonify({
            'id': church_info.id,
            'name': church_info.name,
            'about': church_info.about,
            'vision': church_info.vision,
            'mission': church_info.mission,
            'address': church_info.address,
            'phone': church_info.phone,
            'email': church_info.email,
            'website': church_info.website,
            'created_at': church_info.created_at.isoformat() if church_info.created_at else None,
            'updated_at': church_info.updated_at.isoformat() if church_info.updated_at else None
        })
    else:
        return jsonify({
            'name': 'Deliverance Church International - Kajuki',
            'about': 'A center of transformation where lives are changed through the power of God.',
            'vision': 'To be a leading church in spiritual transformation and community development.',
            'mission': 'To spread the gospel and transform lives through worship, fellowship, and service.',
            'address': 'Kajuki, Kenya',
            'phone': '+254 XXX XXX XXX',
            'email': 'info@dciukajuki.org',
            'website': 'https://dciukajuki.org'
        })

@church_info_bp.route('/', methods=['POST'])
@jwt_required()
def create_church_info():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.church_info import ChurchInfo
    
    data = request.json
    church_info = ChurchInfo(
        name=data['name'],
        about=data.get('about', ''),
        vision=data.get('vision', ''),
        mission=data.get('mission', ''),
        address=data.get('address', ''),
        phone=data.get('phone', ''),
        email=data.get('email', ''),
        website=data.get('website', '')
    )
    db.session.add(church_info)
    db.session.commit()
    return jsonify({'msg': 'Church info created', 'id': church_info.id})

@church_info_bp.route('/', methods=['PUT'])
@jwt_required()
def update_church_info():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.church_info import ChurchInfo
    
    data = request.json
    church_info = ChurchInfo.query.first()
    if not church_info:
        return jsonify({'msg': 'Church info not found'}), 404
    
    church_info.name = data.get('name', church_info.name)
    church_info.about = data.get('about', church_info.about)
    church_info.vision = data.get('vision', church_info.vision)
    church_info.mission = data.get('mission', church_info.mission)
    church_info.address = data.get('address', church_info.address)
    church_info.phone = data.get('phone', church_info.phone)
    church_info.email = data.get('email', church_info.email)
    church_info.website = data.get('website', church_info.website)
    church_info.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Church info updated'}) 