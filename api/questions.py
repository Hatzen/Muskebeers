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

def filter_for_categories(features, categories):
    for category in categories:
        features = list(filter(lambda f: category in f['categories'], features))
    return features

def init(app: Flask):
    @app.route('/question')
    def question():
        categories = request.args.get('categories', [])
        position = request.args.get('position', [7, 51])
        radius = float(request.args.get('radius', 500))
        feature = features

        feature = filter_for_categories(features, categories)
        feature = filter_for_distance(feature, Point(position[0], position[1]), radius)
        feature.append("")
        return feature[0]

if __name__ == "__main__":
    a = Point(7.628817718228859, 51.96275580625961)
    my_features = filter_for_distance(features, a, 165.0)
    print(my_features)
