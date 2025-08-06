from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import parse_jwt_identity

hero_slide_bp = Blueprint('hero_slide_controller', __name__)

@hero_slide_bp.route('/', methods=['GET'])
def get_hero_slides():
    from models.hero_slide import HeroSlide
    slides = HeroSlide.query.filter_by(is_active=True).order_by(HeroSlide.order_num).all()
    return jsonify([{
        'id': s.id,
        'title': s.title,
        'subtitle': s.subtitle,
        'image_url': s.image_url,
        'link_url': s.link_url,
        'order_num': s.order_num,
        'is_active': s.is_active,
        'created_at': s.created_at.isoformat() if s.created_at else None,
        'updated_at': s.updated_at.isoformat() if s.updated_at else None
    } for s in slides])

@hero_slide_bp.route('/<int:slide_id>', methods=['GET'])
@hero_slide_bp.route('/<int:slide_id>/', methods=['GET'])
def get_hero_slide(slide_id):
    from models.hero_slide import HeroSlide
    slide = HeroSlide.query.get_or_404(slide_id)
    return jsonify({
        'id': slide.id,
        'title': slide.title,
        'subtitle': slide.subtitle,
        'image_url': slide.image_url,
        'link_url': slide.link_url,
        'order_num': slide.order_num,
        'is_active': slide.is_active,
        'created_at': slide.created_at.isoformat() if slide.created_at else None,
        'updated_at': slide.updated_at.isoformat() if slide.updated_at else None
    })

@hero_slide_bp.route('/', methods=['POST'])
@jwt_required()
def create_hero_slide():
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.hero_slide import HeroSlide
    from utils.upload import save_file
    
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
    
    slide = HeroSlide(
        title=data.get('title', ''),
        subtitle=data.get('subtitle', ''),
        image_url=image_url or data.get('image', ''),
        link_url=data.get('link_url', ''),
        order_num=data.get('order_num', 0),
        is_active=data.get('is_active', True)
    )
    db.session.add(slide)
    db.session.commit()
    return jsonify({'msg': 'Hero slide created', 'id': slide.id})

@hero_slide_bp.route('/<int:slide_id>', methods=['PUT'])
@hero_slide_bp.route('/<int:slide_id>/', methods=['PUT'])
@jwt_required()
def update_hero_slide(slide_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.hero_slide import HeroSlide
    from utils.upload import save_file, delete_file
    
    slide = HeroSlide.query.get_or_404(slide_id)
    
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
        if slide.image_url and slide.image_url.startswith('/uploads/'):
            delete_file(slide.image_url)
        slide.image_url = save_file(image)
    elif data.get('image'):
        slide.image_url = data.get('image')
    
    slide.title = data.get('title', slide.title)
    slide.subtitle = data.get('subtitle', slide.subtitle)
    slide.link_url = data.get('link_url', slide.link_url)
    slide.order_num = data.get('order_num', slide.order_num)
    slide.is_active = data.get('is_active', slide.is_active)
    slide.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Hero slide updated'})

@hero_slide_bp.route('/<int:slide_id>', methods=['DELETE'])
@hero_slide_bp.route('/<int:slide_id>/', methods=['DELETE'])
@jwt_required()
def delete_hero_slide(slide_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.hero_slide import HeroSlide
    slide = HeroSlide.query.get_or_404(slide_id)
    slide.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Hero slide deleted'}) 