from database import Base
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship


class Stop(Base):
    __tablename__ = 'stop'
    id = Column(Integer, primary_key=True)
    # The name shown on the stop flag
    name = Column(String(250), nullable=False)
    # The latitude of the stop
    latitude = Column(Float(), nullable=False)
    # The longitude of the stop
    longitude = Column(Float(), nullable=False)
    # A collection of services this stop serves
    services = relationship("Service",
                    secondary='stop_service',
                    backref="stop")

    # Serialise the object
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}