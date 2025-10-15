from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_marshmallow import Marshmallow
from sqlalchemy import MetaData

app = Flask(__name__)
