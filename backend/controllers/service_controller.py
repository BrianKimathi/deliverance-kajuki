from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin
from utils.upload import save_file, delete_file

service_bp = Blueprint('service_controller', __name__)

@service_bp.route('/', methods=['GET'])
def get_services():
    from models.service import Service
    services = Service.query.filter_by(is_active=True).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'time': s.time,
        'day': s.day,
        'is_active': s.is_active,
        'created_at': s.created_at.isoformat() if s.created_at else None,
        'updated_at': s.updated_at.isoformat() if s.updated_at else None
    } for s in services])

@service_bp.route('/<int:service_id>', methods=['GET'])
@service_bp.route('/<int:service_id>/', methods=['GET'])
def get_service(service_id):
    from models.service import Service
    s = Service.query.get_or_404(service_id)
    return jsonify({
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'time': s.time,
        'day': s.day,
        'is_active': s.is_active,
        'created_at': s.created_at.isoformat() if s.created_at else None,
        'updated_at': s.updated_at.isoformat() if s.updated_at else None
    })

@service_bp.route('/', methods=['POST'])
@jwt_required()
def create_service():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.service import Service
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
    else:
        data = request.form.to_dict()
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_active']:
                data[key] = data[key].lower() == 'true'
    
    s = Service(
        name=data['name'],
        description=data.get('description', ''),
        time=data.get('time', ''),
        day=data.get('day', ''),
        is_active=data.get('is_active', True)
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({'msg': 'Service created', 'id': s.id})

@service_bp.route('/<int:service_id>', methods=['PUT'])
@service_bp.route('/<int:service_id>/', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.service import Service
    s = Service.query.get_or_404(service_id)
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
    else:
        data = request.form.to_dict()
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_active']:
                data[key] = data[key].lower() == 'true'
    
    s.name = data.get('name', s.name)
    s.description = data.get('description', s.description)
    s.time = data.get('time', s.time)
    s.day = data.get('day', s.day)
    s.is_active = data.get('is_active', s.is_active)
    s.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Service updated'})

@service_bp.route('/<int:service_id>', methods=['DELETE'])
@service_bp.route('/<int:service_id>/', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.service import Service
    s = Service.query.get_or_404(service_id)
    s.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Service deleted'}) 