import os, uuid, json
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import database, routes


config = {
    "sql-path": "//tmp/muskebeers.sqlite",
    "host": "127.0.0.1"
}
config_path = __file__.replace("main.py", "config.json")
if not os.path.isfile(config_path):
    with open(config_path, "w") as cfg_file:
        json.dump(config, cfg_file, indent=4)
else:
    with open(config_path, "r") as cfg_file:
        config = json.load(cfg_file)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite://{config['sql-path']}"
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.secret_key = str(uuid.uuid1())
database.db = SQLAlchemy(app)
database.init()
routes.init(app)


# Run
if __name__ == "__main__":
    kwargs = {
        "host": f"{config['host']}",
        "port": 5000,
        "use_reloader": True
    }
    app.run(**kwargs)
