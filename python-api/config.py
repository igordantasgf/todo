from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://default:efsDQy8Mt9uA@ep-autumn-dream-20888543-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'
db = SQLAlchemy(app)