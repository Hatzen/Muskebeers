from . import index, questions, extra


def init(app):
    index.init(app)
    questions.init(app)
    extra.init(app)
