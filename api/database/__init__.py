from flask_sqlalchemy import SQLAlchemy


db: SQLAlchemy = None
def init():
    # Import all Classes
    from . import user
    db.create_all()
