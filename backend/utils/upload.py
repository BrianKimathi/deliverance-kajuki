import os
import uuid
import time
from werkzeug.utils import secure_filename
from flask import current_app, request

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'mp4', 'mov', 'avi'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file, folder='uploads'):
    """Save uploaded file and return the file path"""
    if file and allowed_file(file.filename):
        # Generate unique filename with timestamp
        filename = secure_filename(file.filename)
        timestamp = int(time.time() * 1000)  # Milliseconds timestamp
        unique_id = uuid.uuid4().hex[:8]  # Short unique ID
        name, ext = os.path.splitext(filename)
        unique_filename = f"{timestamp}_{unique_id}_{name}{ext}"
        
        # Create folder if it doesn't exist
        upload_folder = os.path.join(current_app.root_path, '..', folder)
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Return URL that will work with the Flask route
        return f"/uploads/{unique_filename}"
    
    return None

def delete_file(file_path):
    """Delete a file from the uploads directory"""
    if file_path and file_path.startswith('/uploads/'):
        filename = file_path.split('/uploads/')[-1]
        full_path = os.path.join(current_app.root_path, '..', 'uploads', filename)
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
    return False

def get_file_url(filename):
    """Get the full URL for a file"""
    if filename and filename.startswith('/uploads/'):
        # For development, construct the full URL
        host = request.host_url.rstrip('/') if request else 'http://localhost:5000'
        return f"{host}{filename}"
    return filename 