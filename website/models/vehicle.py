from database import Base
from sqlalchemy import Column, Integer, String, Float


# This model is not related to any other models right now. That's because sometimes the service_name is null.
class Vehicle(Base):
    __tablename__ = 'vehicle'
    id = Column(Integer, primary_key=True)
    # The fleet ID of the vehicle
    vehicle_id = Column(Integer, nullable=False)
    # The destination displayed on the vehicle's destination board. Can be null.
    destination = Column(String(250))
    # The speed (in miles per hour) of the vehicle
    speed = Column(Integer, nullable=False)
    # The heading (in degrees, 0-360) of the vehicle
    heading = Column(Integer, nullable=False)
    # The most recently broadcasted latitude of the vehicle
    latitude = Column(Float(), nullable=False)
    # The most recently broadcasted longitude of the vehicle
    longitude = Column(Float(), nullable=False)
    # The service that the vehicle is currently operating on. Can be null.
    service_name = Column(String(250))

    # Serialise the object
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}