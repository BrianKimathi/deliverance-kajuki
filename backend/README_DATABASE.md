# MySQL Database Setup for Deliverance Church Website

This guide will help you set up and configure MySQL database for the Deliverance Church Website project.

## Prerequisites

- Ubuntu/Debian Linux system
- Python 3.7+
- sudo privileges

## Quick Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
cd backend
python database_setup.py
```

This script will:
- Install MySQL if not present
- Create the database and user
- Set up configuration files
- Create all database tables

### Option 2: Manual Setup

#### 1. Install MySQL

```bash
sudo apt update
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 2. Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

#### 3. Create Database and User

```bash
sudo mysql -u root -p
```

In MySQL prompt:
```sql
CREATE DATABASE dciukajuki;
CREATE USER 'dciukajuki_user'@'localhost' IDENTIFIED BY 'dciukajuki_password';
GRANT ALL PRIVILEGES ON dciukajuki.* TO 'dciukajuki_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 5. Create Environment File

Create a `.env` file in the backend directory:

```bash
# Database Configuration
DATABASE_URL=mysql://dciukajuki_user:dciukajuki_password@localhost/dciukajuki

# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production

# Flask Settings
FLASK_ENV=development
FLASK_DEBUG=1
```

#### 6. Initialize Database Tables

```bash
python init_db.py
```

## Database Schema

The application includes the following models:

- **User**: Authentication and user management
- **Sermon**: Sermon recordings with YouTube integration
- **Event**: Church events and activities
- **Announcement**: Church announcements
- **Devotional**: Daily devotionals
- **Pastor**: Pastor information
- **Ministry**: Ministry details
- **MinistryCard**: Ministry cards for display
- **Resource**: Church resources
- **FormSubmission**: Contact form submissions
- **Service**: Church services and times
- **ChurchInfo**: General church information
- **HeroSlide**: Homepage hero slides
- **Giving**: Donations and tithing

## Database Management

### View Database Tables

```bash
mysql -u dciukajuki_user -p dciukajuki
```

```sql
SHOW TABLES;
```

### Backup Database

```bash
mysqldump -u dciukajuki_user -p dciukajuki > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
mysql -u dciukajuki_user -p dciukajuki < backup_file.sql
```

## Troubleshooting

### Common Issues

1. **Connection Error**: Check if MySQL service is running
   ```bash
   sudo systemctl status mysql
   ```

2. **Access Denied**: Verify user credentials and privileges
   ```bash
   sudo mysql -u root -p
   SHOW GRANTS FOR 'dciukajuki_user'@'localhost';
   ```

3. **Import Error**: Install mysqlclient
   ```bash
   sudo apt install python3-dev default-libmysqlclient-dev build-essential
   pip install mysqlclient
   ```

### Reset Database

To completely reset the database:

```bash
sudo mysql -u root -p
```

```sql
DROP DATABASE dciukajuki;
CREATE DATABASE dciukajuki;
GRANT ALL PRIVILEGES ON dciukajuki.* TO 'dciukajuki_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Then run:
```bash
python init_db.py
```

## Production Considerations

1. **Change default passwords** in production
2. **Use strong secret keys** for Flask and JWT
3. **Enable SSL** for database connections
4. **Set up regular backups**
5. **Configure proper firewall rules**

## API Endpoints

Once the database is set up, the following API endpoints will be available:

- `/api/auth/*` - Authentication endpoints
- `/api/sermons` - Sermon management
- `/api/events` - Event management
- `/api/ministries` - Ministry management
- `/api/announcements` - Announcement management
- `/api/devotionals` - Devotional management
- `/api/pastors` - Pastor management
- `/api/resources` - Resource management
- `/api/services` - Service management
- `/api/giving` - Giving/donation management
- `/api/contact` - Contact form handling

## Testing the Setup

Run the Flask application:

```bash
python app.py
```

The API will be available at `http://localhost:5000` 