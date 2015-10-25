from flask import Blueprint, render_template, redirect, url_for, session, request, flash, g
from flask.ext.login import current_user, login_user, logout_user, login_required
import requests
import json
from constants import *
from oauth import OAuthSignIn
from models.User import User
from database import db_session

# View responsible for rendering basic static pages not related to any models: Home page, About page, Login page
home = Blueprint('home', __name__)
# Home
@home.route('/home')
@home.route('/')
def home_page():
    return render_template("pages/home.html")


# About
@home.route('/about')
def about_page():
    return render_template("pages/about.html")


# Login
@home.route('/login')
def login_page():
    return render_template("pages/login.html")


# Authorisation
@home.route('/authorise/<provider>')
def oauth_authorise(provider):
    if not current_user.is_anonymous():
        return redirect(url_for('home.home_page'))
    oauth = OAuthSignIn.get_provider(provider)
    return oauth.authorize()


@home.route('/callback/<provider>')
def oauth_callback(provider):
    if not current_user.is_anonymous():
        return redirect(url_for('home.home_page'))
    oauth = OAuthSignIn.get_provider(provider)
    social_id, username, email = oauth.callback()
    if social_id is None:
        flash('Authentication failed.')
        return redirect(url_for('home.home_page'))
    user = db_session.query(User).filter_by(social_id=social_id).first()
    if not user:
        user = User(social_id=social_id, nickname=username, email=email)
        db_session.add(user)
        db_session.commit()
    login_user(user, True)
    return redirect(url_for('home.home_page'))


# Logout
@home.route('/logout')
def logout_page():
    logout_user()
    return redirect(url_for('home.home_page'))