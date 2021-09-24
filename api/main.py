import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/lightning-talk.sqlite"
create_db = not os.path.isfile("/tmp/lightning-talk.sqlite") # If the File does not exist, the schema needs to be created
db = SQLAlchemy(app)


# Table of Content
@app.route('/')
def index():
    attr = {
        "content": []
    }
    return render_template("index.html.j2", **attr)

if create_db:
    print("Creating DB")
    db.create_all()

# Run
if __name__ == "__main__":
    kwargs = {
        'host': '0.0.0.0',
        'port': 5000
    }
    app.run(**kwargs)
