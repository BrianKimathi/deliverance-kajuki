from extensions import db

# Import all models to ensure they are registered with SQLAlchemy
from .user import User
from .sermon import Sermon
from .event import Event
from .ministry_card import MinistryCard  # Import before Ministry
from .ministry import Ministry
from .ministry_image import MinistryImage
from .announcement import Announcement
from .devotional import Devotional
from .pastor import Pastor
from .resource import Resource
from .service import Service
from .church_info import ChurchInfo
from .giving import Giving
from .giving_transaction import GivingTransaction
from .church_member import ChurchMember, MemberMinistry
from .hero_slide import HeroSlide
from .form_submission import FormSubmission 