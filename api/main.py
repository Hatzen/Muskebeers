import questions
import uuid
from flask import Flask, render_template, session, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import database

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/lightning-talk.sqlite"
app.secret_key = str(uuid.uuid1())
database.db = SQLAlchemy(app)
database.init()

from database.user import User


# Table of Content
@app.route("/")
def index():
    attr = {
        "content": []
    }

    if session.get("id") is None:
        session["id"] = str(uuid.uuid1())
    existing_user = User.query.filter_by(session=session["id"]).first()
    if existing_user is not None:
        session["name"] = existing_user.get_name()
        print(session["name"])
        return redirect(url_for("game"))
    return render_template("index.html.j2", **attr)

@app.route("/join-game", methods=["POST"])
def setUsername():
    form = request.form.to_dict()
    name = form.get("name", None)
    if name is not None:
        user = User(session=session["id"], name=name)
        database.db.session.add(user)
        database.db.session.commit()
        session["name"] = user.get_name()
        return {"status": "OK"}

@app.route("/session-test")
def sessionTest():
    attr = {
        "session_id": session.get("id")
    }
    return render_template("session_test.html.j2", **attr)

@app.route("/game")
def game():
    sid = session.get("id")
    user = User.query.filter_by(session=sid).first()
    if user is None:
        return redirect(url_for("index"))
    attr = {
        "session_id": sid,
        "name": user.get_name()
    }
    return render_template("game.html.j2", **attr)

questions.init(app)
# Run
if __name__ == "__main__":
    kwargs = {
        'host': '0.0.0.0',
        'port': 5000
    }
    app.run(**kwargs)
