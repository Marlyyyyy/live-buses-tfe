from database import Base
from flask.ext.login import UserMixin
from sqlalchemy import Column, Integer, String

class User(Base, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    social_id = Column(String(64), nullable=False, unique=True)
    nickname = Column(String(64), nullable=False)
    email = Column(String(64), nullable=True)

    def __repr__(self):
        return '<User %r>' % (self.nickname)