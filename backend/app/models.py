from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.db.database import Base
import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # id = Column(String, primary_key=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)

class TokenTable(Base):
    __tablename__ = "token"
    user_id = Column(String, primary_key=True)
    access_token = Column(String(450), primary_key=True)
    refresh_token = Column(String(450),nullable=False)
    status = Column(Boolean)
    created_date = Column(DateTime, default=datetime.datetime.now)

class Conversation(Base):
    __tablename__ = "conversations"
    typee = Column(String)
    conv_id = Column(Integer, primary_key=True)
    sender_name = Column(String)
    receiver_name = Column(String)
    sender_id = Column(Integer)
    receiver_id = Column(Integer)
    msg_content =  Column(String)
    msg_timestamp = Column(DateTime, default=datetime.datetime.now)
    session_id = Column(Integer) 

class Message(Base):
    __tablename__ = "messages"
    msg_id = Column(Integer, primary_key=True)
    sender_id = Column(String)
    receiver_id = Column(String)
    msg_content_sender_encrypted =  Column(String)
    msg_content_receiver_encrypted =  Column(String)
    msg_timestamp = Column(DateTime, default=datetime.datetime.now)
    msg_type = Column(String)

class UserKeys(Base):
    __tablename__ = "user_keys"
    user_id = Column(String, primary_key=True)
    public_key = Column(String)
    active = Column(Boolean)
   
