from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

cal_app = Flask(__name__)
cal_app.config.from_object(Config)
db = SQLAlchemy(cal_app)
migrate = Migrate(cal_app,db)

from app import routes, models
