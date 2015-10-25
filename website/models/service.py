from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Service(Base):
    __tablename__ = 'service'
    id = Column(Integer, primary_key=True)
    # The name of the service (Edinburgh Trams is designated as T50)
    name = Column(String(250), nullable=False)
    # Can be day, express, night or tram
    service_type = Column(String(250), nullable=False)
    # The canonical description of the service
    description = Column(String(250), nullable=False)
    # Route of the service. Limited to one for now.
    route = Column(String(5000), nullable=False)
    # A collection of all stops this service will stop at
    stops = relationship("Stop",
                    secondary='stop_service',
                    backref="service")

    # Serialise the object
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}