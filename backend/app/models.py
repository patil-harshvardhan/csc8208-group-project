from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.db.database import Base
import datetime
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

class TokenTable(Base):
    __tablename__ = "token"
    user_id = Column(Integer)
    access_token = Column(String(450), primary_key=True)
    refresh_token = Column(String(450),nullable=False)
    status = Column(Boolean)
    created_date = Column(DateTime, default=datetime.datetime.now)

class ConversationTable(Base):
    __tablename__ = "conversation"
    typee = Column(String)
    conv_id = Column(Integer, primary_key=True)
    sender_name = Column(String)
    receiver_name = Column(String)
    sender_id = Column(Integer)
    receiver_id = Column(Integer)
    msg_content =  Column(String)
    msg_timestamp = Column(DateTime, default=datetime.datetime.now)
    session_id = Column(Integer)     
