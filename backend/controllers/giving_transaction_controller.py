from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import parse_jwt_identity

giving_transaction_bp = Blueprint('giving_transaction_controller', __name__)

@giving_transaction_bp.route('/', methods=['GET'])
@jwt_required()
def get_giving_transactions():
    from models.giving_transaction import GivingTransaction
    transactions = GivingTransaction.query.order_by(GivingTransaction.created_at.desc()).all()
    return jsonify([{
        'id': t.id,
        'donor_name': t.donor_name,
        'amount': float(t.amount),
        'payment_method': t.payment_method,
        'reference_number': t.reference_number,
        'phone_number': t.phone_number,
        'purpose': t.purpose,
        'is_anonymous': t.is_anonymous,
        'created_at': t.created_at.isoformat() if t.created_at else None,
        'updated_at': t.updated_at.isoformat() if t.updated_at else None
    } for t in transactions])

@giving_transaction_bp.route('/<int:transaction_id>', methods=['GET'])
@giving_transaction_bp.route('/<int:transaction_id>/', methods=['GET'])
@jwt_required()
def get_giving_transaction(transaction_id):
    from models.giving_transaction import GivingTransaction
    transaction = GivingTransaction.query.get_or_404(transaction_id)
    return jsonify({
        'id': transaction.id,
        'donor_name': transaction.donor_name,
        'amount': float(transaction.amount),
        'payment_method': transaction.payment_method,
        'reference_number': transaction.reference_number,
        'phone_number': transaction.phone_number,
        'purpose': transaction.purpose,
        'is_anonymous': transaction.is_anonymous,
        'created_at': transaction.created_at.isoformat() if transaction.created_at else None,
        'updated_at': transaction.updated_at.isoformat() if transaction.updated_at else None
    })

@giving_transaction_bp.route('/', methods=['POST'])
def create_giving_transaction():
    """Public endpoint to create giving transaction without authentication"""
    from models.giving_transaction import GivingTransaction
    data = request.json
    transaction = GivingTransaction(
        donor_name=data.get('donor_name', ''),
        amount=data.get('amount', 0),
        payment_method=data.get('payment_method', ''),
        reference_number=data.get('reference_number', ''),
        phone_number=data.get('phone_number', ''),
        purpose=data.get('purpose', ''),
        is_anonymous=data.get('is_anonymous', False)
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({'msg': 'Giving transaction created', 'id': transaction.id})

@giving_transaction_bp.route('/<int:transaction_id>', methods=['PUT'])
@giving_transaction_bp.route('/<int:transaction_id>/', methods=['PUT'])
@jwt_required()
def update_giving_transaction(transaction_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.giving_transaction import GivingTransaction
    transaction = GivingTransaction.query.get_or_404(transaction_id)
    data = request.json
    
    transaction.donor_name = data.get('donor_name', transaction.donor_name)
    transaction.amount = data.get('amount', transaction.amount)
    transaction.payment_method = data.get('payment_method', transaction.payment_method)
    transaction.reference_number = data.get('reference_number', transaction.reference_number)
    transaction.phone_number = data.get('phone_number', transaction.phone_number)
    transaction.purpose = data.get('purpose', transaction.purpose)
    transaction.is_anonymous = data.get('is_anonymous', transaction.is_anonymous)
    transaction.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'msg': 'Giving transaction updated'})

@giving_transaction_bp.route('/<int:transaction_id>', methods=['DELETE'])
@giving_transaction_bp.route('/<int:transaction_id>/', methods=['DELETE'])
@jwt_required()
def delete_giving_transaction(transaction_id):
    user_info = parse_jwt_identity()
    if not user_info or not user_info.get('is_admin'):
        return jsonify({'msg': 'Admins only'}), 403
    
    from models.giving_transaction import GivingTransaction
    transaction = GivingTransaction.query.get_or_404(transaction_id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'msg': 'Giving transaction deleted'}) 