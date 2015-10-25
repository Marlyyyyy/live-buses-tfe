import unittest
from sqlalchemy import create_engine
from database import db_session, Base
from app import app


class BaseTest(unittest.TestCase):
    def setUp(self):
        # This will create a test database in the memory
        engine = create_engine('sqlite:///:memory:')
        db_session.configure(bind=engine)

        self.app = app.test_client()

        # Create those tables which have been imported
        Base.metadata.create_all(engine)

    def tearDown(self):
        db_session.remove()