from marshmallow import ValidationError, validates, fields, post_load
from marshmallow_sqlalchemy import auto_field
from config import db, ma, bcrypt

class User(db.Model):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(30), unique=True, nullable=False)
  email = db.Column(db.String(50), unique=True, nullable=False)
  _password_hash = db.Column(db.String, nullable=False)

  def set_password(self, password):
    if len(password) < 8:
      raise ValidationError('Password must be at least 8 characters')
    
    password_hash = bcrypt.generate_password_hash(password)
    self._password_hash = password_hash.decode('utf-8')

  def authenticate(self, password):
    return bcrypt.check_password_hash(self._password_hash, password)
  
  def __repr__(self):
    return f'<User {self.username}'
  
class UserSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = User
    load_instance = False
    exclude = ('_password_hash',)

  username = auto_field(required=True)
  email = auto_field(required=True)
  password = fields.String(load_only=True, required=True)

  @validates('username')
  def validate_username(self, username, **kargs):
    if len(username) < 3:
      raise ValidationError('Username must be at least 3 characters')
    
    if not all(c.isalnum() or c.spaces() for c in username):
      raise ValidationError('Username contains only numbers, letters and spaces')
    
  @validates('email')
  def validate_email(self, email, **kargs):
    if len(email) < 8:
      raise ValidationError('Email must be at least 8 characters')
    
    if not "@" in email or not "." in email:
      raise ValidationError("Invalid email format")
    
  @post_load
  def make_user(self, data, **kargs):
    if isinstance(data, dict):
      password = data.pop('password', None)
      if not password:
        raise ValidationError('Password is required for registration')
      
      user = User(**data)
      user.set_password(password)
      return user
    return data