import math

class Point:
    earth_factor = 40000000 / 365

    def __init__(self, lng, lat):
        self.lng = float(lng)
        self.lat = float(lat)
    
    def distance(self, point):
        a = self.lng - point.lng
        b = self.lat - point.lat
        return math.sqrt(a*a + b*b) * self.earth_factor

if __name__ == "__main__":
    a = Point(7.628817718228859, 51.96275580625961)
    b = Point(7.627894799810844, 51.96161551607663)
    print(a.earth_factor)
    print(a.distance(b))
    print(b.distance(a))
