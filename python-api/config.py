from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

PASSWORD = os.environ.get("POSTGRES_PASSWORD")

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://default:{}@ep-autumn-dream-20888543-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'.format(PASSWORD)

CORS(app, resources={r"/*": {"origins": "*"}})
db = SQLAlchemy(app)