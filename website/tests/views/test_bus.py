from tests.base_test import BaseTest
from views.bus import update_live_locations, update_services_stops, delete_services_stops
from database import db_session
from models.vehicle import Vehicle
from models.stop import Stop
from models.service import Service
import json


class BusTest(BaseTest):

    def create_dummy_data(self):
        # Create dummy vehicle
        test_vehicle = Vehicle()
        test_vehicle.vehicle_id = 5
        test_vehicle.destination = "North Pole"
        test_vehicle.speed = 250
        test_vehicle.heading = 10
        test_vehicle.latitude = 1.111111
        test_vehicle.longitude = 1.22222
        test_vehicle.service_name = "xxx"
        db_session.add(test_vehicle)

        # Create dummy stop
        test_stop = Stop()
        test_stop.name = "North Pole"
        test_stop.latitude = 1.22222
        test_stop.longitude = 1.3333
        db_session.add(test_stop)

        # Create dummy service
        test_service = Service()
        test_service.name = "xxx"
        test_service.description = "best service 2014"
        test_service.service_type = "DAY"
        test_service.route = "[{'destination':'Gyle Centre','points':[{'latitude':55.93879,'longitude':-3.104563},{'latitude':55.93862,'longitude':-3.105503}]}]"
        test_service.stops.append(test_stop)
        db_session.add(test_service)

        db_session.commit()
        db_session.flush()

    def setUp(self):
        # Keep the original setUp functionality as well
        super(BusTest, self).setUp()
        self.create_dummy_data()

    def test_get_vehicles(self):
        # First request triggers the update of the database -> vehicle gone
        response = self.app.post('/get/vehicles', data={"services[]": ["10"]})
        self.assertEquals(response.status_code, 200)

        # Need to make vehicle again, and request for it, so that data won't need to be updated yet
        self.create_dummy_data()
        response = self.app.post('/get/vehicles', data={"services[]": ["xxx"]})
        self.assertEquals(response.status_code, 200)

        response_json = response.data
        response_data = json.loads(response_json)
        vehicles = response_data["vehicles"]
        self.assertEquals(len(vehicles), 1)
        test_vehicle = vehicles[0]
        self.assertEquals(test_vehicle["speed"], 250)

    def test_get_stop_names(self):
        # First request triggers the update of the database -> North Pole gone
        response = self.app.post('/get/stop_names', data={"stop_name": "Nor"})
        self.assertEquals(response.status_code, 200)

        # Need to make North Pole again, and request for it, so that data won't need to be updated yet
        self.create_dummy_data()
        response = self.app.post('/get/stop_names', data={"stop_name": "North Pole"})
        self.assertEquals(response.status_code, 200)
        response_json = response.data
        response_data = json.loads(response_json)
        stop_names = response_data["stop_names"]
        self.assertEquals(len(stop_names), 1)
        test_stop = stop_names[0].decode('utf-8')
        self.assertEquals(test_stop, "North Pole")

    def test_get_route_and_stops(self):
        # First request triggers the update of the database -> North Pole gone
        response = self.app.post('/get/route_and_stops', data={"service": "xxx"})
        self.assertEquals(response.status_code, 200)

        # Need to make North Pole again, and request for it, so that data won't need to be updated yet
        self.create_dummy_data()
        response = self.app.post('/get/route_and_stops', data={"service": "xxx"})
        self.assertEquals(response.status_code, 200)
        response_json = response.data
        response_data = json.loads(response_json)
        service = response_data["service"]
        self.assertEquals(service["description"], "best service 2014")

    def test_delete_service_stop(self):

        # Get all services initially
        q = db_session.query(Service)
        services = q.filter(Service.name == "xxx").all()
        self.assertEquals(len(services), 1)

        # Get all stops to test the association as well
        q = db_session.query(Stop)
        stops = q.filter(Stop.services.contains(services[0])).all()
        self.assertEquals(len(stops), 1)

        # Test the delete function for stops and services
        delete_services_stops()

        # Get all services initially
        q = db_session.query(Service)
        services = q.filter(Service.name == "xxx").all()
        self.assertEquals(len(services), 0)

        # Get all stops to test the association as well
        q = db_session.query(Stop)
        stops = q.filter().all()
        self.assertEquals(len(stops), 0)

    def test_update_service_stops(self):

        # Clear the tables initially then update it with all new data. This might take a few seconds.
        delete_services_stops()
        update_services_stops()

        # Assume that service 5 exists
        q = db_session.query(Service)
        services = q.filter(Service.name == "5").all()
        self.assertEqual(len(services), 1)

        # Assume that every service should have more than 1 stops
        q = db_session.query(Stop)
        stops = q.filter(Stop.services.contains(services[0])).all()
        self.assertGreater(len(stops), 1)