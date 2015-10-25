from database import db_session
from tests.base_test import BaseTest
from sqlalchemy.exc import IntegrityError
from models.vehicle import Vehicle
from views.bus import update_live_locations


class VehicleTest(BaseTest):

    # This function should throw an exception
    def insert_invalid_null(self):
        new_vehicle = Vehicle()
        new_vehicle.vehicle_id = None  # Should not be null, so we expect and exception
        new_vehicle.service_name = "test"
        new_vehicle.destination = "test"
        new_vehicle.heading = 50
        new_vehicle.latitude = 4.00
        new_vehicle.longitude = 5.00
        new_vehicle.speed = 40
        db_session.add(new_vehicle)
        db_session.commit()
        db_session.flush()

    def test_constraints(self):
        self.assertRaises(IntegrityError, self.insert_invalid_null)

    def test_successful_insert(self):
        # Create sample vehicle and insert it into our test database
        new_vehicle = Vehicle()
        new_vehicle.vehicle_id = 5
        new_vehicle.service_name = "test"
        new_vehicle.destination = "test"
        new_vehicle.heading = 50
        new_vehicle.latitude = 4.00
        new_vehicle.longitude = 5.00
        new_vehicle.speed = 40
        db_session.add(new_vehicle)
        db_session.commit()
        db_session.flush()

        vehicles = Vehicle.query.all()
        self.assertEqual(len(vehicles), 1)
        test_vehicle = vehicles[0]
        self.assertEqual(test_vehicle.service_name, "test")

    def test_update_live_locations(self):
        update_live_locations()
        vehicles = Vehicle.query.all()
        self.assertGreater(len(vehicles), 1)