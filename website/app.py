from flask import Flask, render_template, g
from flask_gravatar import Gravatar
from database import db_session, init_db
from flask.ext.login import current_user

app = Flask(__name__)
app.config.from_object('config')

# Login setup
from auth import login_manager

login_manager.init_app(app)

gravatar = Gravatar(app,
                    size=100,
                    rating='g',
                    default='retro',
                    force_default=False,
                    use_ssl=False,
                    base_url=None)


@app.before_request
def before_request():
    g.user = current_user

# View setup
from views.home import home
from views.user import user
from views.bus import bus

# Register blueprints
app.register_blueprint(home)
app.register_blueprint(user)
app.register_blueprint(bus)

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

# Start up the web-server in case this file is executed
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
