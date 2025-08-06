from flask import Blueprint, request, jsonify
from extensions import db
from flask_jwt_extended import jwt_required
from datetime import datetime
from utils.utils import is_admin

church_member_bp = Blueprint('church_member_controller', __name__)

@church_member_bp.route('/', methods=['GET'])
@jwt_required()
def get_church_members():
    """Get all church members with optional filtering"""
    from models.church_member import ChurchMember, MemberMinistry
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        # Get query parameters for filtering
        ministry_id = request.args.get('ministry_id', type=int)
        gender = request.args.get('gender')
        marital_status = request.args.get('marital_status')
        is_active = request.args.get('is_active', type=lambda v: v.lower() == 'true' if v else None)
        search = request.args.get('search')
        
        # Start with base query
        query = ChurchMember.query
        
        # Apply filters
        if ministry_id:
            # Filter members who are assigned to the specified ministry
            member_ids = db.session.query(MemberMinistry.member_id).filter(
                MemberMinistry.ministry_id == ministry_id,
                MemberMinistry.is_active == True
            ).subquery()
            query = query.filter(ChurchMember.id.in_(member_ids))
        
        if gender:
            query = query.filter(ChurchMember.gender == gender)
        
        if marital_status:
            query = query.filter(ChurchMember.marital_status == marital_status)
        
        if is_active is not None:
            query = query.filter(ChurchMember.is_active == is_active)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    ChurchMember.first_name.ilike(search_term),
                    ChurchMember.last_name.ilike(search_term),
                    ChurchMember.email.ilike(search_term),
                    ChurchMember.phone.ilike(search_term)
                )
            )
        
        members = query.all()
        
        # Get ministry assignments for each member
        result = []
        for member in members:
            assignments = MemberMinistry.query.filter_by(member_id=member.id, is_active=True).all()
            member_data = {
                'id': member.id,
                'first_name': member.first_name,
                'last_name': member.last_name,
                'full_name': member.full_name,
                'email': member.email,
                'phone': member.phone,
                'date_of_birth': member.date_of_birth.isoformat() if member.date_of_birth else None,
                'address': member.address,
                'gender': member.gender,
                'marital_status': member.marital_status,
                'baptism_date': member.baptism_date.isoformat() if member.baptism_date else None,
                'membership_date': member.membership_date.isoformat() if member.membership_date else None,
                'is_active': member.is_active,
                'notes': member.notes,
                'created_at': member.created_at.isoformat() if member.created_at else None,
                'updated_at': member.updated_at.isoformat() if member.updated_at else None,
                'ministry_assignments': [{
                    'id': assignment.id,
                    'ministry_id': assignment.ministry_id,
                    'ministry_name': assignment.ministry.name if assignment.ministry else None,
                    'role': assignment.role,
                    'start_date': assignment.start_date.isoformat() if assignment.start_date else None,
                    'end_date': assignment.end_date.isoformat() if assignment.end_date else None,
                    'is_active': assignment.is_active
                } for assignment in assignments]
            }
            result.append(member_data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@church_member_bp.route('/<int:member_id>', methods=['GET'])
@jwt_required()
def get_church_member(member_id):
    """Get a specific church member with ministry assignments"""
    from models.church_member import ChurchMember, MemberMinistry
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        member = ChurchMember.query.get_or_404(member_id)
        
        # Get ministry assignments
        assignments = MemberMinistry.query.filter_by(member_id=member_id, is_active=True).all()
        
        return jsonify({
            'id': member.id,
            'first_name': member.first_name,
            'last_name': member.last_name,
            'full_name': member.full_name,
            'email': member.email,
            'phone': member.phone,
            'date_of_birth': member.date_of_birth.isoformat() if member.date_of_birth else None,
            'address': member.address,
            'gender': member.gender,
            'marital_status': member.marital_status,
            'baptism_date': member.baptism_date.isoformat() if member.baptism_date else None,
            'membership_date': member.membership_date.isoformat() if member.membership_date else None,
            'is_active': member.is_active,
            'notes': member.notes,
            'created_at': member.created_at.isoformat() if member.created_at else None,
            'updated_at': member.updated_at.isoformat() if member.updated_at else None,
            'ministry_assignments': [{
                'id': assignment.id,
                'ministry_id': assignment.ministry_id,
                'ministry_name': assignment.ministry.name if assignment.ministry else None,
                'role': assignment.role,
                'start_date': assignment.start_date.isoformat() if assignment.start_date else None,
                'end_date': assignment.end_date.isoformat() if assignment.end_date else None,
                'is_active': assignment.is_active
            } for assignment in assignments]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@church_member_bp.route('/', methods=['POST'])
@jwt_required()
def create_church_member():
    """Create a new church member"""
    from models.church_member import ChurchMember
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        data = request.json
        
        # Parse dates
        date_of_birth = None
        if data.get('date_of_birth'):
            try:
                date_of_birth = datetime.fromisoformat(data['date_of_birth'].replace('Z', '+00:00'))
            except:
                pass
        
        baptism_date = None
        if data.get('baptism_date'):
            try:
                baptism_date = datetime.fromisoformat(data['baptism_date'].replace('Z', '+00:00'))
            except:
                pass
        
        member = ChurchMember(
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            email=data.get('email'),
            phone=data.get('phone'),
            date_of_birth=date_of_birth,
            address=data.get('address'),
            gender=data.get('gender'),
            marital_status=data.get('marital_status'),
            baptism_date=baptism_date,
            is_active=data.get('is_active', True),
            notes=data.get('notes')
        )
        
        db.session.add(member)
        db.session.commit()
        
        return jsonify({
            'msg': 'Church member created successfully',
            'id': member.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@church_member_bp.route('/<int:member_id>', methods=['PUT'])
@jwt_required()
def update_church_member(member_id):
    """Update a church member"""
    from models.church_member import ChurchMember
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        member = ChurchMember.query.get_or_404(member_id)
        data = request.json
        
        # Update fields
        if 'first_name' in data:
            member.first_name = data['first_name']
        if 'last_name' in data:
            member.last_name = data['last_name']
        if 'email' in data:
            member.email = data['email']
        if 'phone' in data:
            member.phone = data['phone']
        if 'address' in data:
            member.address = data['address']
        if 'gender' in data:
            member.gender = data['gender']
        if 'marital_status' in data:
            member.marital_status = data['marital_status']
        if 'notes' in data:
            member.notes = data['notes']
        if 'is_active' in data:
            member.is_active = data['is_active']
        
        # Parse dates
        if 'date_of_birth' in data and data['date_of_birth']:
            try:
                member.date_of_birth = datetime.fromisoformat(data['date_of_birth'].replace('Z', '+00:00'))
            except:
                pass
        
        if 'baptism_date' in data and data['baptism_date']:
            try:
                member.baptism_date = datetime.fromisoformat(data['baptism_date'].replace('Z', '+00:00'))
            except:
                pass
        
        member.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'msg': 'Church member updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@church_member_bp.route('/<int:member_id>', methods=['DELETE'])
@jwt_required()
def delete_church_member(member_id):
    """Delete a church member"""
    from models.church_member import ChurchMember
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        member = ChurchMember.query.get_or_404(member_id)
        db.session.delete(member)
        db.session.commit()
        
        return jsonify({'msg': 'Church member deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Ministry Assignment endpoints
@church_member_bp.route('/<int:member_id>/ministries', methods=['POST'])
@jwt_required()
def assign_ministry(member_id):
    """Assign a member to a ministry"""
    from models.church_member import ChurchMember, MemberMinistry
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        member = ChurchMember.query.get_or_404(member_id)
        data = request.json
        
        assignment = MemberMinistry(
            member_id=member_id,
            ministry_id=data.get('ministry_id'),
            role=data.get('role'),
            is_active=data.get('is_active', True)
        )
        
        db.session.add(assignment)
        db.session.commit()
        
        return jsonify({'msg': 'Ministry assignment created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@church_member_bp.route('/<int:member_id>/ministries/<int:assignment_id>', methods=['DELETE'])
@jwt_required()
def remove_ministry_assignment(member_id, assignment_id):
    """Remove a ministry assignment"""
    from models.church_member import MemberMinistry
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        assignment = MemberMinistry.query.get_or_404(assignment_id)
        assignment.is_active = False
        assignment.end_date = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'msg': 'Ministry assignment removed successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@church_member_bp.route('/export-pdf', methods=['GET'])
@jwt_required()
def export_members_pdf():
    """Export church members to PDF"""
    from models.church_member import ChurchMember, MemberMinistry
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from io import BytesIO
    from flask import send_file
    
    if not is_admin():
        return jsonify({'msg': 'Admins only'}), 403
    
    try:
        # Get query parameters for filtering
        ministry_id = request.args.get('ministry_id', type=int)
        gender = request.args.get('gender')
        marital_status = request.args.get('marital_status')
        is_active = request.args.get('is_active', type=lambda v: v.lower() == 'true' if v else None)
        search = request.args.get('search')
        
        # Apply same filtering logic as get_church_members
        query = ChurchMember.query
        
        if ministry_id:
            member_ids = db.session.query(MemberMinistry.member_id).filter(
                MemberMinistry.ministry_id == ministry_id,
                MemberMinistry.is_active == True
            ).subquery()
            query = query.filter(ChurchMember.id.in_(member_ids))
        
        if gender:
            query = query.filter(ChurchMember.gender == gender)
        
        if marital_status:
            query = query.filter(ChurchMember.marital_status == marital_status)
        
        if is_active is not None:
            query = query.filter(ChurchMember.is_active == is_active)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    ChurchMember.first_name.ilike(search_term),
                    ChurchMember.last_name.ilike(search_term),
                    ChurchMember.email.ilike(search_term),
                    ChurchMember.phone.ilike(search_term)
                )
            )
        
        members = query.all()
        
        # Create PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        # Title
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        
        title = Paragraph("Deliverance Church International - Kajuki<br/>Church Members Report", title_style)
        elements.append(title)
        elements.append(Spacer(1, 20))
        
        # Filter information
        filter_info = []
        if ministry_id:
            from models.ministry import Ministry
            ministry = Ministry.query.get(ministry_id)
            if ministry:
                filter_info.append(f"Ministry: {ministry.name}")
        if gender:
            filter_info.append(f"Gender: {gender}")
        if marital_status:
            filter_info.append(f"Marital Status: {marital_status}")
        if is_active is not None:
            filter_info.append(f"Status: {'Active' if is_active else 'Inactive'}")
        if search:
            filter_info.append(f"Search: {search}")
        
        if filter_info:
            filter_text = " | ".join(filter_info)
            filter_para = Paragraph(f"<b>Filters:</b> {filter_text}", styles['Normal'])
            elements.append(filter_para)
            elements.append(Spacer(1, 20))
        
        # Summary
        summary_para = Paragraph(f"<b>Total Members:</b> {len(members)}", styles['Normal'])
        elements.append(summary_para)
        elements.append(Spacer(1, 20))
        
        # Table data
        data = [['Name', 'Contact', 'Gender', 'Status', 'Ministries']]
        
        for member in members:
            # Get ministry assignments
            assignments = MemberMinistry.query.filter_by(member_id=member.id, is_active=True).all()
            ministry_names = [f"{assignment.ministry.name} ({assignment.role})" for assignment in assignments if assignment.ministry]
            ministries_text = ", ".join(ministry_names) if ministry_names else "None"
            
            # Contact info
            contact_info = []
            if member.email:
                contact_info.append(member.email)
            if member.phone:
                contact_info.append(member.phone)
            contact_text = "<br/>".join(contact_info) if contact_info else "N/A"
            
            data.append([
                member.full_name,
                contact_text,
                member.gender or "N/A",
                "Active" if member.is_active else "Inactive",
                ministries_text
            ])
        
        # Create table
        table = Table(data, colWidths=[2*inch, 2*inch, 1*inch, 1*inch, 2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ]))
        
        elements.append(table)
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        # Generate filename
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"church_members_{timestamp}.pdf"
        
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 