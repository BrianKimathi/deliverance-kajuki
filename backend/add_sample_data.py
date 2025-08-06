#!/usr/bin/env python3
"""
Script to add sample data to the database for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from extensions import db
from models.sermon import Sermon
from models.event import Event
from models.ministry import Ministry
from models.announcement import Announcement
from models.devotional import Devotional
from models.giving import Giving
from datetime import datetime, timedelta

def add_sample_data():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        Sermon.query.delete()
        Event.query.delete()
        Ministry.query.delete()
        Announcement.query.delete()
        Devotional.query.delete()
        Giving.query.delete()
        
        # Clear ministry related data
        from models.ministry_card import MinistryCard
        from models.ministry_image import MinistryImage
        MinistryCard.query.delete()
        MinistryImage.query.delete()
        
        # Add sample sermons
        sermons = [
            Sermon(
                title="Walking in Faith",
                date=datetime.now().date() - timedelta(days=7),
                speaker="Pastor John Doe",
                youtube_url="https://www.youtube.com/watch?v=example1",
                description="A powerful message about walking in faith through difficult times."
            ),
            Sermon(
                title="God's Grace",
                date=datetime.now().date() - timedelta(days=14),
                speaker="Pastor Jane Smith",
                youtube_url="https://www.youtube.com/watch?v=example2",
                description="Understanding and receiving God's grace in our lives."
            ),
            Sermon(
                title="Building Community",
                date=datetime.now().date() - timedelta(days=21),
                speaker="Pastor Mike Johnson",
                youtube_url="https://www.youtube.com/watch?v=example3",
                description="How to build and strengthen our church community."
            )
        ]
        
        for sermon in sermons:
            db.session.add(sermon)
        
        # Add sample events
        events = [
            Event(
                title="Youth Camp",
                description="Annual youth camp for teenagers",
                image="https://images.unsplash.com/photo-1517841905240-472988babdf9",
                start_date=datetime.now().date() + timedelta(days=30),
                end_date=datetime.now().date() + timedelta(days=35),
                is_multiday=True,
                start_time=datetime.strptime("09:00", "%H:%M").time(),
                end_time=datetime.strptime("17:00", "%H:%M").time(),
                same_time_all_days=True
            ),
            Event(
                title="Marriage Seminar",
                description="Special seminar for married couples",
                image="https://images.unsplash.com/photo-1464983953574-0892a716854b",
                start_date=datetime.now().date() + timedelta(days=15),
                end_date=datetime.now().date() + timedelta(days=15),
                is_multiday=False,
                start_time=datetime.strptime("10:00", "%H:%M").time(),
                end_time=datetime.strptime("16:00", "%H:%M").time(),
                same_time_all_days=True
            ),
            Event(
                title="Prayer Night",
                description="Monthly prayer night",
                image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
                start_date=datetime.now().date() + timedelta(days=7),
                end_date=datetime.now().date() + timedelta(days=7),
                is_multiday=False,
                start_time=datetime.strptime("19:00", "%H:%M").time(),
                end_time=datetime.strptime("22:00", "%H:%M").time(),
                same_time_all_days=True
            )
        ]
        
        for event in events:
            db.session.add(event)
        
        # Add sample ministries
        ministries = [
            Ministry(
                name="Children Ministry",
                slug="children",
                description="Nurturing children in faith and love",
                long_description="Our children's ministry provides a safe and loving environment where children can learn about God's love through age-appropriate activities, stories, and songs.",
                image="https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
                leader="Sarah Johnson",
                contact_email="children@dciukajuki.org",
                contact_phone="0712345678",
                meeting_times="Sundays 9:30 AM",
                is_active=True,
                order=1
            ),
            Ministry(
                name="Youth Ministry",
                slug="youth",
                description="Empowering the next generation",
                long_description="Our youth ministry focuses on building strong relationships with God and each other through Bible study, worship, and fun activities.",
                image="https://images.unsplash.com/photo-1503676382389-4809596d5290",
                leader="Michael Kimani",
                contact_email="youth@dciukajuki.org",
                contact_phone="0723456789",
                meeting_times="Sundays 2:00 PM",
                is_active=True,
                order=2
            ),
            Ministry(
                name="Men's Ministry",
                slug="men",
                description="Building Christ-like men",
                long_description="Our men's ministry equips men to lead in their families, church, and community through fellowship, Bible study, and service opportunities.",
                image="https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
                leader="David Mwangi",
                contact_email="men@dciukajuki.org",
                contact_phone="0734567890",
                meeting_times="Saturdays 8:00 AM",
                is_active=True,
                order=3
            )
        ]
        
        for ministry in ministries:
            db.session.add(ministry)
        
        # Commit ministries first to get their IDs
        db.session.commit()
        
        # Add sample ministry cards for men's ministry
        from models.ministry_card import MinistryCard
        from models.ministry_image import MinistryImage
        
        # Get the men's ministry
        men_ministry = Ministry.query.filter_by(slug='men').first()
        
        if men_ministry:
            # Add ministry cards
            ministry_cards = [
                MinistryCard(
                    ministry_id=men_ministry.id,
                    title="Fellowship",
                    description="Regular gatherings for men to connect, share, and encourage one another in their walk with Christ.",
                    order_num=1
                ),
                MinistryCard(
                    ministry_id=men_ministry.id,
                    title="Leadership",
                    description="Workshops and mentorship programs to develop strong, godly leaders for the home, church, and society.",
                    order_num=2
                ),
                MinistryCard(
                    ministry_id=men_ministry.id,
                    title="Service",
                    description="Opportunities to serve the church and community through outreach, projects, and support.",
                    order_num=3
                )
            ]
            
            for card in ministry_cards:
                db.session.add(card)
            
            # Add ministry images
            ministry_images = [
                MinistryImage(
                    ministry_id=men_ministry.id,
                    image_url="https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
                    caption="Men's Fellowship",
                    order=1
                ),
                MinistryImage(
                    ministry_id=men_ministry.id,
                    image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                    caption="Leadership Training",
                    order=2
                ),
                MinistryImage(
                    ministry_id=men_ministry.id,
                    image_url="https://images.unsplash.com/photo-1464983953574-0892a716854b",
                    caption="Community Service",
                    order=3
                )
            ]
            
            for image in ministry_images:
                db.session.add(image)
        
        # Add sample data for Youth ministry
        youth_ministry = Ministry.query.filter_by(slug='youth').first()
        if youth_ministry:
            youth_cards = [
                MinistryCard(
                    ministry_id=youth_ministry.id,
                    title="IGNITE",
                    description="This is a teen-centric discipleship program that runs from 8-9 a.m. before the DeliTeens service. We hold a crash-program during the school holidays for the boarders.",
                    order_num=1
                ),
                MinistryCard(
                    ministry_id=youth_ministry.id,
                    title="Small Groups",
                    description="Our small groups foster deep friendships, accountability, and spiritual growth through regular meetings and activities.",
                    order_num=2
                ),
                MinistryCard(
                    ministry_id=youth_ministry.id,
                    title="Prayers and Bible Study",
                    description="Join us every Thursday at the Teens' sanctuary 5:30 p.m. to 7:30 p.m. for powerful prayer and Bible study sessions.",
                    order_num=3
                )
            ]
            
            for card in youth_cards:
                db.session.add(card)
            
            youth_images = [
                MinistryImage(
                    ministry_id=youth_ministry.id,
                    image_url="https://images.unsplash.com/photo-1503676382389-4809596d5290",
                    caption="Youth Fellowship",
                    order=1
                ),
                MinistryImage(
                    ministry_id=youth_ministry.id,
                    image_url="https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
                    caption="Bible Study",
                    order=2
                ),
                MinistryImage(
                    ministry_id=youth_ministry.id,
                    image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                    caption="Youth Activities",
                    order=3
                )
            ]
            
            for image in youth_images:
                db.session.add(image)
        
        # Add sample data for Children ministry
        children_ministry = Ministry.query.filter_by(slug='children').first()
        if children_ministry:
            children_cards = [
                MinistryCard(
                    ministry_id=children_ministry.id,
                    title="Sunday School",
                    description="Age-appropriate Bible lessons and activities for children of all ages.",
                    order_num=1
                ),
                MinistryCard(
                    ministry_id=children_ministry.id,
                    title="Children's Choir",
                    description="Music and worship training for children to develop their talents and love for God.",
                    order_num=2
                ),
                MinistryCard(
                    ministry_id=children_ministry.id,
                    title="Vacation Bible School",
                    description="Special programs during school holidays to keep children engaged in learning about God.",
                    order_num=3
                )
            ]
            
            for card in children_cards:
                db.session.add(card)
            
            children_images = [
                MinistryImage(
                    ministry_id=children_ministry.id,
                    image_url="https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
                    caption="Sunday School",
                    order=1
                ),
                MinistryImage(
                    ministry_id=children_ministry.id,
                    image_url="https://images.unsplash.com/photo-1464983953574-0892a716854b",
                    caption="Children's Activities",
                    order=2
                ),
                MinistryImage(
                    ministry_id=children_ministry.id,
                    image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                    caption="Learning and Fun",
                    order=3
                )
            ]
            
            for image in children_images:
                db.session.add(image)
        
        # Add sample announcements
        announcements = [
            Announcement(
                title="Church Family Day",
                content="Join us for a day of fun, food, and fellowship after the main service!",
                is_active=True
            ),
            Announcement(
                title="Baptism Class",
                content="Sign up for our upcoming baptism class. All ages welcome!",
                is_active=True
            ),
            Announcement(
                title="Prayer Night",
                content="Don't miss our monthly prayer night at the main sanctuary.",
                is_active=True
            )
        ]
        
        for announcement in announcements:
            db.session.add(announcement)
        
        # Add sample devotionals
        devotionals = [
            Devotional(
                title="Daily Bread",
                content="Start your day with God's word and find strength for your journey.",
                author="Pastor John Doe",
                is_active=True
            ),
            Devotional(
                title="Evening Reflection",
                content="End your day with gratitude and prayer.",
                author="Pastor Jane Smith",
                is_active=True
            )
        ]
        
        for devotional in devotionals:
            db.session.add(devotional)
        
        # Add sample giving methods
        giving_methods = [
            Giving(
                name="M-Pesa Giving",
                description="Send money to our M-Pesa number for tithes, offerings, and donations",
                account_name="Deliverance Church International",
                is_active=True
            ),
            Giving(
                name="Equity Bank",
                description="Bank transfer to our Equity Bank account",
                account_name="Deliverance Church International",
                account_number="1234567890",
                bank_name="Equity Bank",
                is_active=True
            ),
            Giving(
                name="KCB Bank",
                description="Bank transfer to our KCB Bank account",
                account_name="Deliverance Church International",
                account_number="0987654321",
                bank_name="KCB Bank",
                is_active=True
            )
        ]
        
        for method in giving_methods:
            db.session.add(method)
        
        # Commit all changes
        db.session.commit()
        
        print("✅ Sample data added successfully!")
        print(f"📖 Added {len(sermons)} sermons")
        print(f"📅 Added {len(events)} events")
        print(f"🙏 Added {len(ministries)} ministries")
        print(f"📢 Added {len(announcements)} announcements")
        print(f"📚 Added {len(devotionals)} devotionals")
        print(f"💰 Added {len(giving_methods)} giving methods")

if __name__ == "__main__":
    add_sample_data() 