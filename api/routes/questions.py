import json
from flask import Flask, request, session
from models.point import Point


active_question = {} # Each SessionID has exactly one question: {sid -> question}
features = []
questions_path = "../static/data/questions.geojson"
with open(questions_path, "r") as questions_file:
    features = json.load(questions_file)["features"]

def filter_for_distance(features, point, radius):
    accepable_distance_features = []

    for feature in features:
        coordinates = feature['geometry']['coordinates']
        feature_position = Point(coordinates[0], coordinates[1])
        if point.distance(feature_position) <= radius:
            accepable_distance_features.append(feature)

    return accepable_distance_features

def filter_for_categories(features, categories):
    if len(categories) == 0:
        return features
    for category in categories:
        features = list(filter(lambda f: category.capitalize() in f["properties"]["categories"], features))
    return features

def filter_for_solved(features):
    from database.user import Answers
    answers = [a.question_id for a in Answers.query.filter_by(session=session.get("id", ""))]
    features = list(filter(lambda f: f["properties"]["id"] not in answers, features))

def init(app: Flask):
    @app.route('/question')
    def question():
        categories = request.args.getlist('categories')
        position = request.args.getlist('position')
        lng, lat = position if len(position) == 2 else [0, 0]
        radius = float(request.args.get('radius', 150000))

        feature = filter_for_solved(features)
        feature = filter_for_categories(features, categories)
        feature = filter_for_distance(feature, Point(lng, lat), radius)
        if len(feature) == 0:
            return {"feature": None, "args": request.args}
        active_question[session["id"]] = feature[0]["properties"]["id"]
        return {"feature": feature[0], "args": request.args}

    @app.route("/checkpoint-reached", methods=["POST"])
    def checkpointReached():
        from database.user import Answers
        from database import db
        sid = session["id"]
        qid = active_question.get(sid, None)
        if qid is None:
            return {"status": "Failed - No Active Question", "score": 0}
        a = Answers.query.filter_by(question_id=qid, session=sid).first()
        if a is not None:
            return {"status": "Already Solved!", "score": a.score}
        a = Answers(question_id=qid, session=sid, score=1, was_scanned=False)
        db.session.add(a)
        db.session.commit()
        return {"status": "OK", "score": a.score}


if __name__ == "__main__":
    a = Point(7.628817718228859, 51.96275580625961)
    my_features = filter_for_distance(features, a, 165.0)
    print(my_features)
