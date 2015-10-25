from flask import Blueprint, jsonify, g
from flask_login import login_required
from database import db_session
from models.associations import UserService
from models.service import Service
from sqlalchemy import exc

# View responsible for requests which modify the user model: Registration, Favourites
user = Blueprint('user', __name__)

@user.route('/favourites/get', methods=["GET"])
@login_required
def get_favourites():

    q = db_session.query(UserService, Service)
    favourites_assoc = q.filter(UserService.user_id == g.user.id).filter(Service.id == UserService.service_id).all()

    # Create array of serialised objects
    favourites_array = []
    for favourite in favourites_assoc:
        favourites_array.append(favourite[1].name)

    return jsonify(favourites=favourites_array)

@user.route('/favourites/put/<string:service_name>', methods=["GET"])
@login_required
def add_favourite(service_name):

    q = db_session.query(Service)
    try:
        service = q.filter(Service.name == service_name).one()
    except exc.SQLAlchemyError:
        return "", 404  # NOT FOUND

    new_user_service = UserService()
    new_user_service.user_id = g.user.id
    new_user_service.service_id = service.id

    db_session.add(new_user_service)

    try:
        db_session.commit()
    except exc.IntegrityError:
        return "", 409  # CONFLICT

    db_session.flush()

    return "", 201  # CREATED

@user.route('/favourites/delete/<string:service_name>', methods=["GET"])
@login_required
def remove_favourite(service_name):

    q = db_session.query(Service)
    try:
        service = q.filter(Service.name == service_name).one()
    except exc.SQLAlchemyError:
        return "", 404  # NOT FOUND

    service_q = db_session.query(UserService)
    try:
        service_record = service_q.filter(UserService.service_id == service.id).filter(UserService.user_id == g.user.id).one()
    except exc.SQLAlchemyError:
        return "", 404  # NOT FOUND

    try:
        db_session.delete(service_record)
        db_session.commit()
        db_session.flush()
    except exc.InvalidRequestError:
        return "", 422  #  UNPROCESSABLE ENTITY

    return "", 202  # ACCEPTED