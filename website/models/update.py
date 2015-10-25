from database import Base
from sqlalchemy import Column, Integer, String, DateTime, exists
from datetime import datetime
from database import db_session


class Update(Base):
    __tablename__ = 'updates'
    id = Column(Integer, primary_key=True)
    # The name of tables that require to be update
    table_name = Column(String(250), nullable=False)
    # Time-stamp of last update
    last_updated = Column(DateTime())

    def __init__(self):
        self.last_updated = datetime.now()


def is_table_filled(table_name):
    return db_session.query(exists().where(Update.table_name == table_name)).scalar()


# Update the date corresponding to when a specific table was last updated
def update_table_date(table_name, new_date):
    if is_table_filled(table_name):
        service_update = Update.query.filter_by(table_name=table_name).first()
        service_update.last_updated = new_date
    else:
        service_update = Update()
        service_update.table_name = table_name
        service_update.last_updated = new_date

    db_session.add(service_update)
    db_session.commit()
    db_session.flush()


# Returns True if the selected table requires to be updated. Parameter "difference" has to be milliseconds.
def check_if_need_update(table_name, current_date, difference):
    if is_table_filled(table_name):
        service_update = Update.query.filter_by(table_name=table_name).first()
        delta = current_date - service_update.last_updated
        new_time_difference = int(delta.total_seconds() * 1000)
        if new_time_difference > difference:
            return True
        else:
            return False
    else:
        return True