from flask_sqlalchemy import SQLAlchemy


db: SQLAlchemy = None
def init():
    # Import all Classes
    from . import user
    print("###########")
    print()
    print("DROPPING ALL TABLES. database::init")
    print()
    print("###########")
    
    db.drop_all()
    db.create_all()
    user.fill_defaults()
