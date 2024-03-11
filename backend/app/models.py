from sqlalchemy import Column, Integer, String, DateTime, Boolean
from database import base
import datetime
class User(base):
    _tablename_ = "users"
    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100),nullable=False)