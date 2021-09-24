import json
from flask import Flask
from flask import request
from models.point import Point

f = open('questions.json',)
features = json.load(f)['features']
f.close()

def filter_for_distance(features, point, radius):
    accepable_distance_features = []

    for feature in features:
        coordinates = feature['geometry']['coordinates']
        feature_position = Point(coordinates[0], coordinates[1])
        if point.distance(feature_position) <= radius:
            accepable_distance_features.append(feature)

    return accepable_distance_features

def init(app: Flask):
    @app.route('/question')
    def question():
        categories = request.args.get('categories')
        position = request.args.get('position')
        radius = request.args.get('radius')
        feature = features

        for category in categories:
            feature = list(filter(lambda f: category in f['categories'], feature))

        feature = filter_for_distance(feature, Point(position[0], position[1]), radius)

        return feature

if __name__ == "__main__":
    a = Point(7.628817718228859, 51.96275580625961)
    my_features = filter_for_distance(features, a, 165.0)
    print(my_features)
