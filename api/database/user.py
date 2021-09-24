from . import db
import random, uuid, names


class User(db.Model):
    session = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, primary_key=False)
    authenticated = db.Column(db.Boolean, default=False)
    current_score = db.Column(db.Integer, default=0)

class Answers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.String)
    session = db.Column(db.String)
    question = db.Column(db.String)
    score = db.Column(db.Integer, default=0)
    was_scanned = db.Column(db.Boolean, default=False)


def fill_defaults():
    for _ in range(10):
        u = User(
            session=str(uuid.uuid4()),
            name=names.get_first_name(),
            current_score=random.randint(3, 45)
        )
        db.session.add(u)
        db.session.commit()
