from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin
from utils.upload import save_file, delete_file

event_bp = Blueprint('event_controller', __name__)

@event_bp.route('/', methods=['GET'])
def get_events():
    from models.event import Event
    events = Event.query.all()
    return jsonify([{
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'image': e.image,
        'start_date': e.start_date.isoformat(),
        'end_date': e.end_date.isoformat() if e.end_date else None,
        'is_multiday': e.is_multiday,
        'start_time': e.start_time.isoformat() if e.start_time else None,
        'end_time': e.end_time.isoformat() if e.end_time else None,
        'same_time_all_days': e.same_time_all_days
    } for e in events])

@event_bp.route('/<int:event_id>', methods=['GET'])
@event_bp.route('/<int:event_id>/', methods=['GET'])
def get_event(event_id):
    from models.event import Event
    e = Event.query.get_or_404(event_id)
    return jsonify({
        'id': e.id,
        'title': e.title,
        'description': e.description,
        'image': e.image,
        'start_date': e.start_date.isoformat(),
        'end_date': e.end_date.isoformat() if e.end_date else None,
        'is_multiday': e.is_multiday,
        'start_time': e.start_time.isoformat() if e.start_time else None,
        'end_time': e.end_time.isoformat() if e.end_time else None,
        'same_time_all_days': e.same_time_all_days
    })

@event_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.event import Event
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
    else:
        data = request.form.to_dict()
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_multiday', 'same_time_all_days']:
                data[key] = data[key].lower() == 'true'
    
    # Handle file upload
    image_url = data.get('image', '')
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            image_url = save_file(file)
    
    e = Event(
        title=data['title'],
        description=data['description'],
        image=image_url,
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
        is_multiday=data.get('is_multiday', False),
        start_time=datetime.strptime(data['start_time'], '%H:%M:%S').time() if data.get('start_time') and len(data['start_time'].split(':')) == 3 else (datetime.strptime(data['start_time'], '%H:%M').time() if data.get('start_time') else None),
        end_time=datetime.strptime(data['end_time'], '%H:%M:%S').time() if data.get('end_time') and len(data['end_time'].split(':')) == 3 else (datetime.strptime(data['end_time'], '%H:%M').time() if data.get('end_time') else None),
        same_time_all_days=data.get('same_time_all_days', True)
    )
    db.session.add(e)
    db.session.commit()
    return jsonify({'msg': 'Event created', 'id': e.id})

@event_bp.route('/<int:event_id>', methods=['PUT'])
@event_bp.route('/<int:event_id>/', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.event import Event
    e = Event.query.get_or_404(event_id)
    
    # Handle both JSON and FormData
    if request.is_json:
        data = request.json
    else:
        data = request.form.to_dict()
        # Convert string values to appropriate types
        for key in data:
            if key in ['is_multiday', 'same_time_all_days']:
                data[key] = data[key].lower() == 'true'
    
    # Handle file upload
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            # Delete old image if it exists
            if e.image and e.image.startswith('/uploads/'):
                delete_file(e.image)
            e.image = save_file(file)
    elif data.get('image'):
        e.image = data.get('image')
    
    e.title = data.get('title', e.title)
    e.description = data.get('description', e.description)
    e.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else e.start_date
    e.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else e.end_date
    e.is_multiday = data.get('is_multiday', e.is_multiday)
    e.start_time = datetime.strptime(data['start_time'], '%H:%M:%S').time() if data.get('start_time') and len(data['start_time'].split(':')) == 3 else (datetime.strptime(data['start_time'], '%H:%M').time() if data.get('start_time') else e.start_time)
    e.end_time = datetime.strptime(data['end_time'], '%H:%M:%S').time() if data.get('end_time') and len(data['end_time'].split(':')) == 3 else (datetime.strptime(data['end_time'], '%H:%M').time() if data.get('end_time') else e.end_time)
    e.same_time_all_days = data.get('same_time_all_days', e.same_time_all_days)
    
    db.session.commit()
    return jsonify({'msg': 'Event updated'})

@event_bp.route('/<int:event_id>', methods=['DELETE'])
@event_bp.route('/<int:event_id>/', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.event import Event
    e = Event.query.get_or_404(event_id)
    db.session.delete(e)
    db.session.commit()
    return jsonify({'msg': 'Event deleted'}) 