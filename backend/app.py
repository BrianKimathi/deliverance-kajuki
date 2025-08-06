#!/usr/bin/env python3
"""
Deliverance Church Website API Server
A Flask-based REST API for the church website
"""

import os
import logging
from datetime import datetime
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Import extensions
from extensions import db, jwt, migrate

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql://dciukajuki_user:dciukajuki_password@localhost/dciukajuki')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for now
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Configure CORS - More permissive for development
    CORS(app, 
         origins=["http://localhost:5173", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5175", "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5174", "http://127.0.0.1:5174"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True,
         expose_headers=["Content-Type", "Authorization"])
    
    # Import and register blueprints AFTER db initialization
    with app.app_context():
        # Import all models to ensure they are registered with SQLAlchemy
        from models.user import User
        from models.ministry import Ministry
        from models.ministry_card import MinistryCard
        from models.ministry_image import MinistryImage
        from models.announcement import Announcement
        from models.pastor import Pastor
        from models.resource import Resource
        from models.hero_slide import HeroSlide
        from models.event import Event
        from models.sermon import Sermon
        from models.devotional import Devotional
        from models.service import Service
        from models.church_info import ChurchInfo
        from models.giving import Giving
        from models.giving_transaction import GivingTransaction
        from models.form_submission import FormSubmission
        from models.subscription import Subscription
        
        # Import blueprints
        from controllers.auth_controller import auth_bp
        from controllers.user_controller import user_bp
        from controllers.event_controller import event_bp
        from controllers.announcement_controller import announcement_bp
        from controllers.sermon_controller import sermon_bp
        from controllers.ministry_controller import ministry_bp
        from controllers.devotional_controller import devotional_bp
        from controllers.pastor_controller import pastor_bp
        from controllers.resource_controller import resource_bp
        from controllers.service_controller import service_bp
        from controllers.church_info_controller import church_info_bp
        from controllers.contact_controller import contact_bp
        from controllers.giving_controller import giving_bp
        from controllers.giving_transaction_controller import giving_transaction_bp
        from controllers.church_member_controller import church_member_bp
        from controllers.hero_slide_controller import hero_slide_bp
        from controllers.dashboard_controller import dashboard_bp
        from controllers.subscription_controller import subscription_bp
        
        # Register blueprints
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(user_bp, url_prefix='/api/users')
        app.register_blueprint(event_bp, url_prefix='/api/events')
        app.register_blueprint(announcement_bp, url_prefix='/api/announcements')
        app.register_blueprint(sermon_bp, url_prefix='/api/sermons')
        app.register_blueprint(ministry_bp, url_prefix='/api/ministries')
        app.register_blueprint(devotional_bp, url_prefix='/api/devotionals')
        app.register_blueprint(pastor_bp, url_prefix='/api/pastors')
        app.register_blueprint(resource_bp, url_prefix='/api/resources')
        app.register_blueprint(service_bp, url_prefix='/api/services')
        app.register_blueprint(church_info_bp, url_prefix='/api/church-info')
        app.register_blueprint(contact_bp, url_prefix='/api/contact')
        app.register_blueprint(giving_bp, url_prefix='/api/giving')
        app.register_blueprint(giving_transaction_bp, url_prefix='/api/giving-transactions')
        app.register_blueprint(church_member_bp, url_prefix='/api/church-members')
        app.register_blueprint(hero_slide_bp, url_prefix='/api/hero-slides')
        app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
        app.register_blueprint(subscription_bp, url_prefix='/api/subscriptions')
        
        logger.info("✅ All blueprints registered successfully!")
        
        # Test database connection
        try:
            db.engine.connect()
            logger.info("✅ Database connection successful!")
            logger.info(f"📊 Database URL: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
            # Get database info
            with db.engine.connect() as connection:
                result = connection.execute(db.text("SELECT DATABASE()"))
                db_name = result.fetchone()[0]
                logger.info(f"🗄️ Connected to database: {db_name}")
                
                # List tables
                result = connection.execute(db.text("SHOW TABLES"))
                tables = [row[0] for row in result.fetchall()]
                logger.info(f"📋 Found {len(tables)} tables in database")
                logger.info("�� Database tables:")
                for table in tables:
                    logger.info(f"   - {table}")
                    
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            raise e
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'message': 'Deliverance Church API is running'
        })
    
    # API documentation endpoint
    @app.route('/api')
    def api_docs():
        return jsonify({
            'message': 'Deliverance Church Website API',
            'version': '1.0.0',
            'endpoints': {
                'health': '/api/health',
                'auth': '/api/auth/*',
                'users': '/api/users/*',
                'events': '/api/events/*',
                'announcements': '/api/announcements/*',
                'sermons': '/api/sermons/*',
                'ministries': '/api/ministries/*',
                'devotionals': '/api/devotionals/*',
                'pastors': '/api/pastors/*',
                'resources': '/api/resources/*',
                'services': '/api/services/*',
                'church_info': '/api/church-info/*',
                'contact': '/api/contact/*',
                'giving': '/api/giving/*',
                'hero_slides': '/api/hero-slides/*',
                'dashboard': '/api/dashboard/*'
            }
        })

    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory('../uploads', filename)
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    print("🚀 Starting Deliverance Church Website API Server")
    print("=" * 60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    logger.info("🔗 Registering API blueprints...")
    
    print("🎉 Application initialized successfully!")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📚 API Documentation available at: http://localhost:5000/api")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000) 