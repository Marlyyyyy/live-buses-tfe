from database import Base
from sqlalchemy import Column, ForeignKey, Integer


class StopService(Base):
    __tablename__ = 'stop_service'
    stop_id = Column('stop_id', Integer, ForeignKey('stop.id', ondelete="CASCADE"), primary_key=True)
    service_id = Column('service_id', Integer, ForeignKey('service.id', ondelete="CASCADE"), primary_key=True)

class UserService(Base):
    __tablename__ = 'user_service'
    user_id = Column('user_id', Integer, ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
    service_id = Column('service_id', Integer, ForeignKey('service.id', ondelete="CASCADE"), primary_key=True)