from flask import Blueprint, render_template, request, jsonify, g
from flask.ext.login import current_user
import requests
import json
from datetime import datetime
from models.stop import Stop
from models.service import Service
from models.associations import StopService
from models.vehicle import Vehicle
from models.update import update_table_date
from models.associations import UserService
from models.update import *
from database import db_session
from constants import *

# View responsible for requests which use/modify bus related models: Map, Updates
bus = Blueprint('bus', __name__)


# GET request to load Map with all services to choose from
@bus.route('/map')
def map_page():

    # Check if we need to update the services table
    is_update_needed = check_if_need_update("service", datetime.now(), SERVICES_UPDATE_RATE)
    if is_update_needed:
        update_services_stops()

    # Get all service numbers
    service_names = db_session.query(Service.name).all()
    favourites_array = []
    no_favourites = True

    if not current_user.is_anonymous():
        q = db_session.query(UserService, Service)
        favourites_assoc = q.filter(UserService.user_id == g.user.id).filter(Service.id == UserService.service_id).all()

        # Create array of serialised objects
        for favourite in favourites_assoc:
            favourites_array.append(favourite[1].name)

        if len(favourites_array) == 0:
            no_favourites = True
        else:
            no_favourites = False

    # Convert each name from unicode to string
    service_names_array = [service_name[0] for service_name in service_names]
    return render_template('pages/map.html', service_names=service_names_array, favourite_names= favourites_array, no_favourites=no_favourites)


# POST request to get all live vehicle data corresponding to the received services
# TODO: Add validation for request methods
@bus.route('/get/vehicles', methods=["POST"])
def get_vehicles():

    # Check if we need to update the vehicles table
    is_update_needed = check_if_need_update("vehicle", datetime.now(), VEHICLES_UPDATE_RATE)
    if is_update_needed:
        update_live_locations()

    # Get POST parameters
    service_numbers = request.form.getlist("services[]")

    # Make sure each service number is a string
    service_numbers = [str(service_number) for service_number in service_numbers]

    # Get all the vehicles whose service numbers are present in the input
    q = db_session.query(Vehicle)
    vehicles = q.filter(Vehicle.service_name.in_(service_numbers)).all()

    # Create array of serialised objects
    vehicles_array = []
    for vehicle in vehicles:
        vehicles_array.append(vehicle.as_dict())

    return jsonify(vehicles=vehicles_array)


# TODO: Add validation for request methods
@bus.route('/get/stop_names', methods=["POST"])
def get_stop_names():

    # Check if we need to update the services table
    is_update_needed = check_if_need_update("stop", datetime.now(), STOPS_UPDATE_RATE)
    if is_update_needed:
        update_services_stops()

    # Get POST parameter
    stop_str = str(request.form["stop_name"])

    # Get the name of all those stops which are starting with stop_str
    stop_names = Stop.query.with_entities(Stop.name).filter(Stop.name.like("%" + stop_str + "%")).all()
    stop_names = [stop[0] for stop in stop_names]

    return jsonify(stop_names=stop_names)


# TODO: Add validation for request methods
@bus.route('/get/route_and_stops', methods=["POST"])
def get_route_and_stops():

    # Check if we need to update the services table
    is_update_needed = check_if_need_update("stop", datetime.now(), STOPS_UPDATE_RATE)
    if is_update_needed:
        update_services_stops()

    # Get POST parameter
    service_name = str(request.form["service"])

    # Get all details of the selected service
    q = db_session.query(Service)
    service = q.filter(Service.name == service_name).all()

    if len(service) > 0:
        service = service[0]

        # Create array of serialised stop objects
        stop_array = []
        for stop in service.stops:
            stop_array.append(stop.as_dict())

        service = service.as_dict()
    else:
        service = {}

    return jsonify(service=service)


def delete_services_stops():

    # Delete existing data from stops, services and their linking table
    Service.query.delete()
    Stop.query.delete()
    StopService.query.delete()

    db_session.commit()
    db_session.flush()


@bus.route('/update')
def update_services_stops():

    # Delete all data first
    delete_services_stops()

    # Get services as json data
    json_data = requests.get(API_SERVICES, headers=API_HEADER)
    service_dict = json.loads(json_data.text)

    # Array of service objects
    services = service_dict["services"]

    # Get stops as json data
    json_data = requests.get(API_STOPS, headers=API_HEADER)
    stop_dict = json.loads(json_data.text)

    # Array of stop objects
    stops = stop_dict["stops"]

    # Update the tables' last_updated field
    service_date = datetime.fromtimestamp(int(service_dict["last_updated"]))
    update_table_date("service", service_date)
    stop_date = datetime.fromtimestamp(int(stop_dict["last_updated"]))
    update_table_date("stop", stop_date)

    # Create a service instance of each service and store them in a new dictionary
    service_dict = {}
    for service in services:
        new_service = Service()
        new_service.name = service["name"]
        new_service.service_type = service["service_type"]
        new_service.description = service["description"]
        new_service.route = json.dumps(service["routes"][0]["points"]) if len(service["routes"]) > 0 else "none"
        service_dict[service["name"]] = new_service
        db_session.add(new_service)

    # Create a stop instance of each stop and add corresponding services to them
    for stop in stops:
        new_stop = Stop()
        new_stop.name = stop["name"]
        new_stop.latitude = stop["latitude"]
        new_stop.longitude = stop["longitude"]

        # Add services to stops
        # Must take the set because sometimes the services are listed multiple times for a particular stop.
        stop_services = set(stop["services"])
        for service_name in stop_services:
            new_stop.services.append(service_dict[service_name])

        db_session.add(new_stop)

    db_session.commit()
    db_session.flush()


def update_live_locations():

    # Delete existing data from vehicles
    Vehicle.query.delete()

    # Get live vehicles as json data
    json_data = requests.get(API_VEHICLES, headers=API_HEADER)
    vehicle_dict = json.loads(json_data.text)

    # Array of service objects
    vehicles = vehicle_dict["vehicles"]

    # Update the vehicle table's last_updated field
    vehicles_date = datetime.fromtimestamp(int(vehicle_dict["last_updated"]))
    update_table_date("vehicle", vehicles_date)

    # Create a vehicle instance of each vehicle.
    for vehicle in vehicles:
        new_vehicle = Vehicle()
        new_vehicle.vehicle_id = vehicle["vehicle_id"]
        new_vehicle.destination = vehicle["destination"]
        new_vehicle.speed = vehicle["speed"]
        new_vehicle.heading = vehicle["heading"]
        new_vehicle.latitude = vehicle["latitude"]
        new_vehicle.longitude = vehicle["longitude"]
        new_vehicle.service_name = vehicle["service_name"]

        db_session.add(new_vehicle)

    db_session.commit()
    db_session.flush()