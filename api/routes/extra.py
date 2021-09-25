from flask import Flask, session
from sqlalchemy import desc


def init(app: Flask):
    @app.route("/highscore")
    def highscore():
        from database.user import User
        hs = User.query.order_by(desc(User.current_score)).limit(10)
        return {"highscore": [[u.name, u.current_score] for u in hs]}

    @app.route("/get-score")
    def userscore():
        from database.user import User, Answers
        user = User.query.filter_by(session=session["id"]).first()
        if user is None:
            return {"status": "Failed- Unknown User", "score": 0}
        score = sum(map(lambda o: o.score, Answers.query.filter_by(session=session["id"])))
        user.current_score = score
        return {"status": "OK", "score": score, "user": user.name}
