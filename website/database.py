from flask_sqlalchemy import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine

# Create an engine that stores data in the local directory's
engine = create_engine('sqlite:///TransportForKlingons.db', convert_unicode=True, echo=True)

# Create session that can be used by the views to access the database
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()

# Create the db schema - called from init_db.py
def init_db():
    from models.service import Service
    from models.stop import Stop
    from models.vehicle import Vehicle
    from models.associations import StopService
    from models.associations import UserService
    from models.update import Update
    from models.User import User
    # Create all tables in the engine.
    Base.metadata.create_all(bind=engine)
