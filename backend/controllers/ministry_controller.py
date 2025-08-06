from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from utils.utils import is_admin
from utils.upload import save_file, delete_file



ministry_bp = Blueprint('ministry_controller', __name__)

@ministry_bp.route('/', methods=['GET'])
def get_ministries():
    from models.ministry import Ministry
    ministries = Ministry.query.filter_by(is_active=True).order_by(Ministry.order).all()
    return jsonify([{
        'id': m.id,
        'name': m.name,
        'slug': m.slug,
        'description': m.description,
        'long_description': m.long_description,
        'image': m.image,
        'leader': m.leader,
        'contact_email': m.contact_email,
        'contact_phone': m.contact_phone,
        'meeting_times': m.meeting_times,
        'is_active': m.is_active,
        'order': m.order,
        'created_at': m.created_at.isoformat() if m.created_at else None,
        'updated_at': m.updated_at.isoformat() if m.updated_at else None
    } for m in ministries])

@ministry_bp.route('/<slug>', methods=['GET'])
@ministry_bp.route('/<slug>/', methods=['GET'])
def get_ministry(slug):
    from models.ministry import Ministry
    m = Ministry.query.filter_by(slug=slug, is_active=True).first_or_404()
    return jsonify({
        'id': m.id,
        'name': m.name,
        'slug': m.slug,
        'description': m.description,
        'long_description': m.long_description,
        'image': m.image,
        'leader': m.leader,
        'contact_email': m.contact_email,
        'contact_phone': m.contact_phone,
        'meeting_times': m.meeting_times,
        'is_active': m.is_active,
        'order': m.order,
        'created_at': m.created_at.isoformat() if m.created_at else None,
        'updated_at': m.updated_at.isoformat() if m.updated_at else None
    })

@ministry_bp.route('/', methods=['POST'])
@jwt_required()
def create_ministry():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.ministry import Ministry
    
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
    
    m = Ministry(
        name=data['name'],
        slug=data['slug'],
        description=data.get('description', ''),
        long_description=data.get('long_description', ''),
        image=image_url or data.get('image', ''),
        leader=data.get('leader', ''),
        contact_email=data.get('contact_email', ''),
        contact_phone=data.get('contact_phone', ''),
        meeting_times=data.get('meeting_times', ''),
        is_active=data.get('is_active', True),
        order=data.get('order', 0)
    )
    db.session.add(m)
    db.session.commit()
    return jsonify({'msg': 'Ministry created', 'id': m.id})

@ministry_bp.route('/<int:ministry_id>', methods=['PUT'])
@ministry_bp.route('/<int:ministry_id>/', methods=['PUT'])
@jwt_required()
def update_ministry(ministry_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.ministry import Ministry
    m = Ministry.query.get_or_404(ministry_id)
    
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
        if m.image and m.image.startswith('/uploads/'):
            delete_file(m.image)
        m.image = save_file(image)
    elif data.get('image'):
        m.image = data.get('image')
    
    m.name = data.get('name', m.name)
    m.slug = data.get('slug', m.slug)
    m.description = data.get('description', m.description)
    m.long_description = data.get('long_description', m.long_description)
    m.leader = data.get('leader', m.leader)
    m.contact_email = data.get('contact_email', m.contact_email)
    m.contact_phone = data.get('contact_phone', m.contact_phone)
    m.meeting_times = data.get('meeting_times', m.meeting_times)
    m.is_active = data.get('is_active', m.is_active)
    m.order = data.get('order', m.order)
    m.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Ministry updated'})

@ministry_bp.route('/<int:ministry_id>', methods=['DELETE'])
@ministry_bp.route('/<int:ministry_id>/', methods=['DELETE'])
@jwt_required()
def delete_ministry(ministry_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.ministry import Ministry
    m = Ministry.query.get_or_404(ministry_id)
    m.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Ministry deleted'})

# Ministry Images endpoints
@ministry_bp.route('/<int:ministry_id>/images', methods=['POST'])
@jwt_required()
def add_ministry_image(ministry_id):
    from models.ministry import Ministry
    from models.ministry_image import MinistryImage
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    ministry = Ministry.query.get_or_404(ministry_id)
    
    if 'image' not in request.files:
        return jsonify({'msg': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'msg': 'No image selected'}), 400
    
    image_url = save_file(file)
    if not image_url:
        return jsonify({'msg': 'Invalid file type'}), 400
    
    ministry_image = MinistryImage(
        ministry_id=ministry_id,
        image_url=image_url,
        caption=request.form.get('caption', ''),
        order=len(ministry.images)
    )
    db.session.add(ministry_image)
    db.session.commit()
    
    return jsonify({'msg': 'Image added', 'id': ministry_image.id})

@ministry_bp.route('/<int:ministry_id>/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_ministry_image(ministry_id, image_id):
    from models.ministry_image import MinistryImage
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    ministry_image = MinistryImage.query.get_or_404(image_id)
    if ministry_image.ministry_id != ministry_id:
        return jsonify({'msg': 'Image not found'}), 404
    
    # Delete the file
    delete_file(ministry_image.image_url)
    
    # Delete the database record
    db.session.delete(ministry_image)
    db.session.commit()
    
    return jsonify({'msg': 'Image deleted'})

# Ministry Cards endpoints
@ministry_bp.route('/<slug>/cards', methods=['POST'])
@jwt_required()
def create_ministry_card(slug):
    from models.ministry_card import MinistryCard
    from models.ministry import Ministry
    
    print(f"🔍 DEBUG: Creating ministry card for slug: {slug}")
    print(f"🔍 DEBUG: Request method: {request.method}")
    print(f"🔍 DEBUG: Request headers: {dict(request.headers)}")
    print(f"🔍 DEBUG: Request data: {request.get_data()}")
    print(f"🔍 DEBUG: Request JSON: {request.json}")
    
    if not is_admin():
        print(f"❌ ERROR: User is not admin")
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        ministry = Ministry.query.filter_by(slug=slug, is_active=True).first_or_404()
        print(f"✅ DEBUG: Found ministry: {ministry.name} (ID: {ministry.id})")
    except Exception as e:
        print(f"❌ ERROR: Ministry not found for slug '{slug}': {str(e)}")
        return jsonify({'msg': f'Ministry not found: {slug}'}), 404
    
    data = request.json
    print(f"🔍 DEBUG: Processing data: {data}")
    
    try:
        card = MinistryCard(
            ministry_id=ministry.id,
            title=data['title'],
            description=data.get('description')
        )
        print(f"✅ DEBUG: Created card object: {card}")
        
        db.session.add(card)
        db.session.commit()
        print(f"✅ DEBUG: Card saved to database with ID: {card.id}")
        
        return jsonify({'msg': 'Ministry card created', 'id': card.id})
    except Exception as e:
        print(f"❌ ERROR: Failed to create card: {str(e)}")
        db.session.rollback()
        return jsonify({'msg': f'Error creating card: {str(e)}'}), 422

@ministry_bp.route('/<slug>/cards/<int:card_id>', methods=['PUT'])
@jwt_required()
def update_ministry_card(slug, card_id):
    from models.ministry_card import MinistryCard
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    card = MinistryCard.query.get_or_404(card_id)
    data = request.json
    
    card.title = data.get('title', card.title)
    card.description = data.get('description', card.description)
    card.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Ministry card updated'})

@ministry_bp.route('/<slug>/cards/<int:card_id>', methods=['DELETE'])
@jwt_required()
def delete_ministry_card(slug, card_id):
    from models.ministry_card import MinistryCard
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    card = MinistryCard.query.get_or_404(card_id)
    db.session.delete(card)
    db.session.commit()
    return jsonify({'msg': 'Ministry card deleted'}) 

# GET endpoints for ministry cards and images
@ministry_bp.route('/<slug>/cards', methods=['GET'])
@ministry_bp.route('/<slug>/cards/', methods=['GET'])
def get_ministry_cards(slug):
    """Get all cards for a specific ministry by slug"""
    from models.ministry import Ministry
    from models.ministry_card import MinistryCard
    
    ministry = Ministry.query.filter_by(slug=slug, is_active=True).first_or_404()
    cards = MinistryCard.query.filter_by(ministry_id=ministry.id).order_by(MinistryCard.order_num).all()
    
    return jsonify([{
        'id': card.id,
        'title': card.title,
        'description': card.description,
        'order': card.order_num,
        'created_at': card.created_at.isoformat() if card.created_at else None,
        'updated_at': card.updated_at.isoformat() if card.updated_at else None
    } for card in cards])

@ministry_bp.route('/<slug>/images', methods=['GET'])
@ministry_bp.route('/<slug>/images/', methods=['GET'])
def get_ministry_images(slug):
    """Get all images for a specific ministry by slug (max 10)"""
    from models.ministry import Ministry
    from models.ministry_image import MinistryImage
    
    ministry = Ministry.query.filter_by(slug=slug, is_active=True).first_or_404()
    images = MinistryImage.query.filter_by(ministry_id=ministry.id).order_by(MinistryImage.order).limit(10).all()
    
    return jsonify([{
        'id': img.id,
        'image_url': img.image_url,
        'caption': img.caption,
        'order': img.order,
        'created_at': img.created_at.isoformat() if img.created_at else None,
        'updated_at': img.updated_at.isoformat() if img.updated_at else None
    } for img in images]) 