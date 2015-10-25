import os
from flask.ext.login import LoginManager

from models.User import User

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))