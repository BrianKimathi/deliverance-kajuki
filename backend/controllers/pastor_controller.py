from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin
from utils.upload import save_file, delete_file

pastor_bp = Blueprint('pastor_controller', __name__)

@pastor_bp.route('/', methods=['GET'])
def get_pastors():
    from models.pastor import Pastor
    pastors = Pastor.query.filter_by(is_active=True).order_by(Pastor.order).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'title': p.title,
        'bio': p.bio,
        'extended_bio': p.extended_bio,
        'image': p.image,
        'email': p.email,
        'phone': p.phone,
        'ministry_responsibilities': p.ministry_responsibilities,
        'is_active': p.is_active,
        'order': p.order,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'updated_at': p.updated_at.isoformat() if p.updated_at else None
    } for p in pastors])

@pastor_bp.route('/<int:pastor_id>', methods=['GET'])
@pastor_bp.route('/<int:pastor_id>/', methods=['GET'])
def get_pastor(pastor_id):
    from models.pastor import Pastor
    p = Pastor.query.get_or_404(pastor_id)
    return jsonify({
        'id': p.id,
        'name': p.name,
        'title': p.title,
        'bio': p.bio,
        'extended_bio': p.extended_bio,
        'image': p.image,
        'email': p.email,
        'phone': p.phone,
        'ministry_responsibilities': p.ministry_responsibilities,
        'is_active': p.is_active,
        'order': p.order,
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'updated_at': p.updated_at.isoformat() if p.updated_at else None
    })

@pastor_bp.route('/', methods=['POST'])
@jwt_required()
def create_pastor():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.pastor import Pastor
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
        image = None
    else:
        data = request.form.to_dict()
        image = request.files.get('image')
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_active']:
                data[key] = data[key].lower() == 'true'
    
    # Save image if provided
    image_url = None
    if image:
        image_url = save_file(image)
    
    p = Pastor(
        name=data['name'],
        title=data.get('title', ''),
        bio=data.get('bio', ''),
        extended_bio=data.get('extended_bio', ''),
        image=image_url or data.get('image', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        ministry_responsibilities=data.get('ministry_responsibilities', ''),
        is_active=data.get('is_active', True),
        order=data.get('order', 0)
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'msg': 'Pastor created', 'id': p.id})

@pastor_bp.route('/<int:pastor_id>', methods=['PUT'])
@pastor_bp.route('/<int:pastor_id>/', methods=['PUT'])
@jwt_required()
def update_pastor(pastor_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.pastor import Pastor
    p = Pastor.query.get_or_404(pastor_id)
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
        image = None
    else:
        data = request.form.to_dict()
        image = request.files.get('image')
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_active']:
                data[key] = data[key].lower() == 'true'
    
    # Update image if provided
    if image:
        # Delete old image if it exists
        if p.image and p.image.startswith('/uploads/'):
            delete_file(p.image)
        p.image = save_file(image)
    elif data.get('image'):
        p.image = data.get('image')
    
    p.name = data.get('name', p.name)
    p.title = data.get('title', p.title)
    p.bio = data.get('bio', p.bio)
    p.extended_bio = data.get('extended_bio', p.extended_bio)
    p.email = data.get('email', p.email)
    p.phone = data.get('phone', p.phone)
    p.ministry_responsibilities = data.get('ministry_responsibilities', p.ministry_responsibilities)
    p.is_active = data.get('is_active', p.is_active)
    p.order = data.get('order', p.order)
    p.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Pastor updated'})

@pastor_bp.route('/<int:pastor_id>', methods=['DELETE'])
@pastor_bp.route('/<int:pastor_id>/', methods=['DELETE'])
@jwt_required()
def delete_pastor(pastor_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.pastor import Pastor
    p = Pastor.query.get_or_404(pastor_id)
    p.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Pastor deleted'}) 