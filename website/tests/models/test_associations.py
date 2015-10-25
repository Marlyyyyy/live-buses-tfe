from database import db_session
from tests.base_test import BaseTest
from models.service import Service
from models.stop import Stop


class AssociationsTest(BaseTest):

    def make_random_stop(self):
        new_stop = Stop()
        new_stop.name = "Stop 23"
        new_stop.latitude = 2.144
        new_stop.longitude = -1.222

        return new_stop

    def make_random_service(self):
        new_service = Service()
        new_service.name = "Service 45"
        new_service.description = "Much service"
        new_service.service_type = "night"
        new_service.route = "[{'destination':'Gyle Centre','points':[{'latitude':55.93879,'longitude':-3.104563},{'latitude':55.93862,'longitude':-3.105503}]}]"

        return new_service

    # Adding stops to services
    def test_service_has_stops(self):
        new_service = self.make_random_service()
        new_stop = self.make_random_stop()
        new_service.stops.append(new_stop)

        db_session.add(new_service)
        db_session.add(new_stop)
        db_session.commit()
        db_session.flush()

        service = Service.query.all()[0]

        self.assertEquals(len(service.stops), 1)

    # Adding services to stops
    def test_stop_has_services(self):
        new_stop = self.make_random_stop()
        new_service = self.make_random_service()
        new_stop.services.append(new_service)

        db_session.add(new_stop)
        db_session.add(new_service)
        db_session.commit()
        db_session.flush()

        stop = Stop.query.all()[0]

        self.assertEquals(len(stop.services), 1)


