from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from utils.utils import parse_jwt_identity

contact_bp = Blueprint('contact_controller', __name__)

@contact_bp.route('/contact', methods=['POST'])
def submit_contact():
    """Public endpoint to submit contact form without authentication"""
    from models.form_submission import FormSubmission
    data = request.json
    form_submission = FormSubmission(
        form_type='contact',
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        message=data.get('message'),
        additional_data=data
    )
    db.session.add(form_submission)
    db.session.commit()
    return jsonify({'msg': 'Contact form submitted successfully'})

@contact_bp.route('/prayer-request', methods=['POST'])
def submit_prayer_request():
    """Public endpoint to submit prayer request without authentication"""
    from models.form_submission import FormSubmission
    data = request.json
    form_submission = FormSubmission(
        form_type='prayer_request',
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        message=data.get('prayer_request'),
        additional_data=data
    )
    db.session.add(form_submission)
    db.session.commit()
    return jsonify({'msg': 'Prayer request submitted successfully'})

@contact_bp.route('/pastoral-care', methods=['POST'])
def submit_pastoral_care():
    """Public endpoint to submit pastoral care request without authentication"""
    from models.form_submission import FormSubmission
    data = request.json
    form_submission = FormSubmission(
        form_type='pastoral_care',
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        message=data.get('request'),
        additional_data=data
    )
    db.session.add(form_submission)
    db.session.commit()
    return jsonify({'msg': 'Pastoral care request submitted successfully'})

@contact_bp.route('/crisis-counselling', methods=['POST'])
def submit_crisis_counselling():
    """Public endpoint to submit crisis counselling request without authentication"""
    from models.form_submission import FormSubmission
    data = request.json
    form_submission = FormSubmission(
        form_type='crisis_counselling',
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        message=data.get('request'),
        additional_data=data
    )
    db.session.add(form_submission)
    db.session.commit()
    return jsonify({'msg': 'Crisis counselling request submitted successfully'})

@contact_bp.route('/baby-dedication', methods=['POST'])
def submit_baby_dedication():
    """Public endpoint to submit baby dedication application without authentication"""
    from models.form_submission import FormSubmission
    data = request.json
    form_submission = FormSubmission(
        form_type='baby_dedication',
        name=data.get('father_name'),
        email=data.get('email'),
        phone=data.get('father_phone'),
        message=f"Father: {data.get('father_name')}, Mother: {data.get('mother_name')}, Child: {data.get('child_name')}",
        additional_data=data
    )
    db.session.add(form_submission)
    db.session.commit()
    return jsonify({'msg': 'Baby dedication application submitted successfully'})

@contact_bp.route('/pre-marital', methods=['POST'])
def submit_pre_marital():
    """Public endpoint to submit pre-marital counselling application without authentication"""
    from models.form_submission import FormSubmission
    data = request.json
    form_submission = FormSubmission(
        form_type='pre_marital',
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        message=f"Partner: {data.get('partner_name')}, Wedding Date: {data.get('wedding_date')}",
        additional_data=data
    )
    db.session.add(form_submission)
    db.session.commit()
    return jsonify({'msg': 'Pre-marital counselling application submitted successfully'})

@contact_bp.route('/form-submissions', methods=['GET'])
@jwt_required()
def get_form_submissions():
    from models.form_submission import FormSubmission
    from utils.utils import is_admin
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    submissions = FormSubmission.query.order_by(FormSubmission.timestamp.desc()).all()
    return jsonify([{
        'id': s.id,
        'form_type': s.form_type,
        'name': s.name,
        'email': s.email,
        'phone': s.phone,
        'message': s.message,
        'additional_data': s.additional_data,
        'is_read': s.is_read,
        'timestamp': s.timestamp.isoformat() if s.timestamp else None
    } for s in submissions]) 

@contact_bp.route('/form-submissions/<int:submission_id>', methods=['GET'])
@jwt_required()
def get_form_submission(submission_id):
    from models.form_submission import FormSubmission
    from utils.utils import is_admin
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    submission = FormSubmission.query.get_or_404(submission_id)
    
    # Mark as read
    submission.is_read = True
    db.session.commit()
    
    return jsonify({
        'id': submission.id,
        'form_type': submission.form_type,
        'name': submission.name,
        'email': submission.email,
        'phone': submission.phone,
        'message': submission.message,
        'additional_data': submission.additional_data,
        'is_read': submission.is_read,
        'timestamp': submission.timestamp.isoformat() if submission.timestamp else None
    })

@contact_bp.route('/form-submissions/<int:submission_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(submission_id):
    from models.form_submission import FormSubmission
    from utils.utils import is_admin
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    submission = FormSubmission.query.get_or_404(submission_id)
    submission.is_read = True
    db.session.commit()
    
    return jsonify({'msg': 'Submission marked as read'})

@contact_bp.route('/form-submissions/<int:submission_id>', methods=['DELETE'])
@jwt_required()
def delete_form_submission(submission_id):
    from models.form_submission import FormSubmission
    from utils.utils import is_admin
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    submission = FormSubmission.query.get_or_404(submission_id)
    db.session.delete(submission)
    db.session.commit()
    
    return jsonify({'msg': 'Submission deleted'}) 