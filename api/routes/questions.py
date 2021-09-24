import json
from flask import Flask, request
from models.point import Point


features = []
questions_path = __file__.replace(".py", ".json")
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

def init(app: Flask):
    @app.route('/question')
    def question():
        categories = request.args.getlist('categories')
        lng, lat = request.args.getlist('position')
        radius = float(request.args.get('radius', 1500))
        feature = features

        feature = filter_for_categories(features, categories)
        feature = filter_for_distance(feature, Point(lng, lat), radius)
        return {"feature": feature, "args": request.args}


if __name__ == "__main__":
    a = Point(7.628817718228859, 51.96275580625961)
    my_features = filter_for_distance(features, a, 165.0)
    print(my_features)
