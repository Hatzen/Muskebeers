from . import db


class User(db.Model):
    session = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, primary_key=False)
    authenticated = db.Column(db.Boolean, default=False)

    def to_json(self):
        return {
            "name": self.name,
            "session": self.session,
            "authenticated": self.authenticated
        }

    def is_authenticated(self):
        return True

    def is_active(self):   
        return True           

    def is_anonymous(self):
        return False          

    def get_id(self):         
        return str(self.id)
    
    def get_name(self):
        return self.name
