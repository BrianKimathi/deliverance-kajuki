from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin

sermon_bp = Blueprint('sermon_controller', __name__)

@sermon_bp.route('/public', methods=['GET'])
def get_public_sermons():
    """Public endpoint to get sermons without authentication"""
    from models.sermon import Sermon
    sermons = Sermon.query.order_by(Sermon.date.desc()).all()
    return jsonify([{
        'id': s.id,
        'title': s.title,
        'date': s.date.isoformat(),
        'speaker': s.speaker,
        'youtube_url': s.youtube_url,
        'description': s.description
    } for s in sermons])

@sermon_bp.route('/', methods=['GET'])
def get_sermons():
    """Public endpoint to get sermons without authentication"""
    from models.sermon import Sermon
    sermons = Sermon.query.order_by(Sermon.date.desc()).all()
    return jsonify([{
        'id': s.id,
        'title': s.title,
        'date': s.date.isoformat(),
        'speaker': s.speaker,
        'youtube_url': s.youtube_url,
        'description': s.description
    } for s in sermons])

@sermon_bp.route('/<int:sermon_id>', methods=['GET'])
@sermon_bp.route('/<int:sermon_id>/', methods=['GET'])
def get_sermon(sermon_id):
    """Public endpoint to get a single sermon without authentication"""
    from models.sermon import Sermon
    s = Sermon.query.get_or_404(sermon_id)
    return jsonify({
        'id': s.id,
        'title': s.title,
        'date': s.date.isoformat(),
        'speaker': s.speaker,
        'youtube_url': s.youtube_url,
        'description': s.description
    })

@sermon_bp.route('/', methods=['POST'])
@jwt_required()
def create_sermon():
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.sermon import Sermon
    data = request.json
    s = Sermon(
        title=data['title'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        speaker=data['speaker'],
        youtube_url=data.get('youtube_url'),
        description=data.get('description')
    )
    db.session.add(s)
    db.session.commit()
    return jsonify({'msg': 'Sermon created', 'id': s.id})

@sermon_bp.route('/<int:sermon_id>', methods=['PUT'])
@sermon_bp.route('/<int:sermon_id>/', methods=['PUT'])
@jwt_required()
def update_sermon(sermon_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.sermon import Sermon
    s = Sermon.query.get_or_404(sermon_id)
    data = request.json
    s.title = data.get('title', s.title)
    if data.get('date'):
        s.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    s.speaker = data.get('speaker', s.speaker)
    s.youtube_url = data.get('youtube_url', s.youtube_url)
    s.description = data.get('description', s.description)
    db.session.commit()
    return jsonify({'msg': 'Sermon updated'})

@sermon_bp.route('/<int:sermon_id>', methods=['DELETE'])
@sermon_bp.route('/<int:sermon_id>/', methods=['DELETE'])
@jwt_required()
def delete_sermon(sermon_id):
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    from models.sermon import Sermon
    s = Sermon.query.get_or_404(sermon_id)
    db.session.delete(s)
    db.session.commit()
    return jsonify({'msg': 'Sermon deleted'}) 