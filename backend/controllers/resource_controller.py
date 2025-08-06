from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import parse_jwt_identity
from utils.upload import save_file, delete_file

resource_bp = Blueprint('resource_controller', __name__)

@resource_bp.route('/', methods=['GET'])
def get_resources():
    """Public endpoint to get resources without authentication"""
    from models.resource import Resource
    resources = Resource.query.filter_by(is_active=True).order_by(Resource.created_at.desc()).all()
    return jsonify([{
        'id': r.id,
        'title': r.title,
        'category': r.category,
        'description': r.description,
        'file_url': r.file_url,
        'is_paid': r.is_paid,
        'price': float(r.price) if r.price else 0.0,
        'status': r.status,
        'is_active': r.is_active,
        'created_at': r.created_at.isoformat() if r.created_at else None,
        'updated_at': r.updated_at.isoformat() if r.updated_at else None
    } for r in resources])

@resource_bp.route('/<int:resource_id>', methods=['GET'])
@resource_bp.route('/<int:resource_id>/', methods=['GET'])
def get_resource(resource_id):
    """Public endpoint to get a single resource without authentication"""
    from models.resource import Resource
    resource = Resource.query.get_or_404(resource_id)
    return jsonify({
        'id': resource.id,
        'title': resource.title,
        'category': resource.category,
        'description': resource.description,
        'file_url': resource.file_url,
        'is_paid': resource.is_paid,
        'price': float(resource.price) if resource.price else 0.0,
        'status': resource.status,
        'is_active': resource.is_active,
        'created_at': resource.created_at.isoformat() if resource.created_at else None,
        'updated_at': resource.updated_at.isoformat() if resource.updated_at else None
    })

@resource_bp.route('/', methods=['POST'])
@jwt_required()
def create_resource():
    from models.resource import Resource
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
        file = None
    else:
        data = request.form.to_dict()
        file = request.files.get('file')
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_paid', 'is_active']:
                data[key] = data[key].lower() == 'true'
    
    # Save file if provided
    file_url = None
    if file:
        file_url = save_file(file)
    
    # Convert price to decimal if provided
    price = 0.0
    if data.get('is_paid') and data.get('price'):
        try:
            price = float(data.get('price', 0))
        except (ValueError, TypeError):
            price = 0.0
    
    resource = Resource(
        title=data['title'],
        category=data.get('category', 'General'),
        description=data.get('description', ''),
        file_url=file_url or data.get('file_url'),
        is_paid=data.get('is_paid', False),
        price=price,
        status=data.get('status', 'published'),
        is_active=data.get('is_active', True)
    )
    db.session.add(resource)
    db.session.commit()
    return jsonify({'msg': 'Resource created', 'id': resource.id})

@resource_bp.route('/<int:resource_id>', methods=['PUT'])
@resource_bp.route('/<int:resource_id>/', methods=['PUT'])
@jwt_required()
def update_resource(resource_id):
    from models.resource import Resource
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    resource = Resource.query.get_or_404(resource_id)
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
        file = None
    else:
        data = request.form.to_dict()
        file = request.files.get('file')
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_paid', 'is_active']:
                data[key] = data[key].lower() == 'true'
    
    # Update file if provided
    if file:
        # Delete old file if it exists
        if resource.file_url and resource.file_url.startswith('/uploads/'):
            delete_file(resource.file_url)
        resource.file_url = save_file(file)
    elif data.get('file_url'):
        resource.file_url = data.get('file_url')
    
    # Convert price to decimal if provided
    if data.get('is_paid') and data.get('price'):
        try:
            resource.price = float(data.get('price', 0))
        except (ValueError, TypeError):
            resource.price = 0.0
    elif not data.get('is_paid'):
        resource.price = 0.0
    
    resource.title = data.get('title', resource.title)
    resource.category = data.get('category', resource.category)
    resource.description = data.get('description', resource.description)
    resource.is_paid = data.get('is_paid', resource.is_paid)
    resource.status = data.get('status', resource.status)
    resource.is_active = data.get('is_active', resource.is_active)
    resource.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Resource updated'})

@resource_bp.route('/<int:resource_id>', methods=['DELETE'])
@resource_bp.route('/<int:resource_id>/', methods=['DELETE'])
@jwt_required()
def delete_resource(resource_id):
    from models.resource import Resource
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    resource = Resource.query.get_or_404(resource_id)
    
    # Delete file if it exists
    if resource.file_url and resource.file_url.startswith('/uploads/'):
        delete_file(resource.file_url)
    
    resource.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Resource deleted'}) 