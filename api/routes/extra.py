from flask import Flask
from sqlalchemy import desc


def init(app: Flask):
    @app.route("/highscore")
    def highscore():
        from database.user import User
        hs = User.query.order_by(desc(User.current_score)).limit(10)
        return {"highscore": [[u.name, u.current_score] for u in hs]}
