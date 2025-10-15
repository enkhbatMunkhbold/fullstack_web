from marshmallow import validates, ValidationError, fields, post_load
from marshmallow_sqlalchemy import auto_field
from config import db, bcrypt, ma

class User(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(30), unique=True, nullable=False)
  email = db.Column(db.String(60), unique=True, nullable=False)
  _password_hash = db.Column(db.String, nullable=False)

  def set_password(self, password):
    if len(password) < 8:
      raise ValueError('Password must be at least 8 characters long')
    password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
    self._password_hash = password_hash.decode('utf-8')

  def authenticate(self, password):
    return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
  
  def __repr__(self):
    return f"<User {self.username}>"