from flask import Blueprint, request, jsonify
from extensions import db
from models.subscription import Subscription
from utils.utils import is_admin
from flask_jwt_extended import jwt_required

subscription_bp = Blueprint('subscription', __name__)

@subscription_bp.route('/subscribe', methods=['POST'])
def subscribe():
    """Public endpoint to subscribe to newsletter"""
    data = request.json
    email = data.get('email')
    name = data.get('name', '')
    
    if not email:
        return jsonify({'msg': 'Email is required'}), 400
    
    # Check if already subscribed
    existing = Subscription.query.filter_by(email=email).first()
    if existing:
        if existing.is_active:
            return jsonify({'msg': 'Email already subscribed'}), 409
        else:
            # Reactivate subscription
            existing.is_active = True
            existing.name = name
            db.session.commit()
            return jsonify({'msg': 'Subscription reactivated successfully'})
    
    # Create new subscription
    subscription = Subscription(email=email, name=name)
    db.session.add(subscription)
    db.session.commit()
    
    return jsonify({'msg': 'Subscribed successfully'})

@subscription_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    """Public endpoint to unsubscribe from newsletter"""
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'msg': 'Email is required'}), 400
    
    subscription = Subscription.query.filter_by(email=email).first()
    if not subscription:
        return jsonify({'msg': 'Email not found in subscriptions'}), 404
    
    subscription.is_active = False
    db.session.commit()
    
    return jsonify({'msg': 'Unsubscribed successfully'})

@subscription_bp.route('/subscriptions', methods=['GET'])
@jwt_required()
def get_subscriptions():
    """Admin endpoint to get all subscriptions"""
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    subscriptions = Subscription.query.order_by(Subscription.created_at.desc()).all()
    return jsonify([{
        'id': s.id,
        'email': s.email,
        'name': s.name,
        'is_active': s.is_active,
        'created_at': s.created_at.isoformat(),
        'updated_at': s.updated_at.isoformat()
    } for s in subscriptions])

@subscription_bp.route('/subscriptions/<int:subscription_id>', methods=['DELETE'])
@jwt_required()
def delete_subscription(subscription_id):
    """Admin endpoint to delete a subscription"""
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    subscription = Subscription.query.get_or_404(subscription_id)
    db.session.delete(subscription)
    db.session.commit()
    
    return jsonify({'msg': 'Subscription deleted'}) 