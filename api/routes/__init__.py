from . import index, questions


def init(app):
    index.init(app)
    questions.init(app)
