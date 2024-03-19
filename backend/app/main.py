from fastapi import Depends, FastAPI, HTTPException, status, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import json

import base64
# from cryptography.fernet import Fernet
import redis
# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

from app.models import User, TokenTable
import app.schemas as schemas
import os 
from app.db.database import SessionLocal, engine, Base
from sqlalchemy.orm import Session
import app.models as models
import app.schemas as schemas

from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Union, Any, Dict
from jose import jwt
from app.auth_bearer import JWTBearer
import pytz
from sqlalchemy import Column, Integer, String, select
from starlette.middleware.cors import CORSMiddleware


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()



def get_application() -> FastAPI:
    application = FastAPI(
        title="Team 6",
    )

    origins = [
        # "http://localhost:3001",
        "http://localhost:3000",
        # "https://localhost:3001",
        # "https://localhost:3002",
    ]
    # application.add_middleware(HTTPSRedirectMiddleware)
    # ADDED ALLOWED HEADERS AS IN TUTORIAL
    allowed_headers = [
        "date",
        "transfer-encoding",
        "accept",
        "accept-encoding",
        "host",
        "origin",
        "referer",
        "user-agent",
        "content-encoding",
        "content-length",
        "content-type",
        "cookie",
        "authorization",
        "bearer",
    ]
    application.add_middleware(
        CORSMiddleware,
        # allow_origins=origins,
        allow_origins= origins,
        allow_methods=["*"],
        # allow_headers=allowed_headers,
        # allow all headers
        allow_headers=["*"],
        allow_credentials=True,
    )

    # application.include_router(
    #     fixtures.router,
    #     prefix="/fixtures",
    #     tags=["fixtures"],
    # )
    return application
app = get_application()



class Message(BaseModel):
    typee: str 
    sender: str
    recipient: str
    message: str
    sessionId: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print("active_connections",self.active_connections)

        while offline_messages.llen(user_id) > 0: # remove the await, redis is sync originally
            message_data = offline_messages.lpop(user_id) # same sync problem
            message = Message(**json.loads(message_data))
            await self.send(message, websocket)

    async def send(self, message: Message, r_websocket : WebSocket):
        # encrypted_message = fernet.encrypt(message.message.encode())
        await r_websocket.send_text(json.dumps({"sender": message.sender, "message": message.message}))
        # await r_websocket.send_text(json.dumps({"sender": message.sender, "message": base64.b64encode(encrypted_message).decode()}))

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id)

    async def send_personal_message(self, message: Message):
        if message.recipient in self.active_connections:
            websocket = self.active_connections[message.recipient]
            await self.send(message, websocket)
            # store in DB
            
        else:
            offline_messages.lpush(message.recipient, json.dumps(message.dict())) # remove await here, redis originally is sync
            

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, dependencies=Depends(JWTBearer()),  session: Session = Depends(get_session)):
    token = dependencies
    print("token: ", token)
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']
    print("user_id: ", user_id)
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = Message(**json.loads(data))
            await manager.send_personal_message(message)
            new_msg = models.Conversation(typee = "msg",sender_id = message.sender, receiver_id = message.recipient ,
                                          sender_name=get_username_by_id(message.sender,session),receiver_name=get_username_by_id(message.recipient,session),
                                           msg_content= message.message, session_id='0000')

            session.add(new_msg)
            session.commit()
            session.refresh(new_msg) 

    except WebSocketDisconnect:
        manager.disconnect(user_id)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str,  session: Session = Depends(get_session)):
    print("user_id: ", user_id)
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = Message(**json.loads(data))
            await manager.send_personal_message(message)
            new_msg = models.Message(sender_id = message.sender, receiver_id = message.recipient ,
                                           msg_content_sender_encrypted= message.msg_content_sender_encrypted, msg_content_receiver_encrypted = message.msg_content_receiver_encrypted,msg_type = message.type)

            session.add(new_msg)
            session.commit()
            session.refresh(new_msg) 

    except WebSocketDisconnect:
        manager.disconnect(user_id)

@app.on_event("startup")
async def startup_event():
    global offline_messages
    # offline_messages = await aioredis.create_redis_pool("redis://localhost")
    offline_messages = redis.Redis(host="redis", decode_responses=True)


@app.on_event("shutdown")
async def shutdown_event():
    pass

# Code for authentication


ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 30 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days
ALGORITHM = "HS256"
JWT_SECRET_KEY = "narscbjim@$@&^@&%^&RFghgjvbdsha"   # should be kept secret
JWT_REFRESH_SECRET_KEY = "13ugfdfgh@#$%^@&jkl45678902"

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)

def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
        
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
         
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
     
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt

# register api 
@app.post("/register")
def register_user(user: schemas.UserCreate, session: Session = Depends(get_session)):
    existing_user = session.query(models.User).filter_by(email=user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    encrypted_password = get_hashed_password(user.password)

    # create new user
    new_user = models.User(username=user.username, email=user.email, password=encrypted_password )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # create user keys
    new_key = models.UserKeys(user_id=new_user.id, public_key=user.public_key, active=True)
    session.add(new_key)
    session.commit()
    session.refresh(new_key)

    return {"message":"user created successfully"}

@app.post('/change-password')
def change_password(request: schemas.changepassword, db: Session = Depends(get_session)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")
    
    if not verify_password(request.old_password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid old password")
    
    encrypted_password = get_hashed_password(request.new_password)
    user.password = encrypted_password
    db.commit()
    
    return {"message": "Password changed successfully"}

@app.post('/login' ,response_model=schemas.TokenSchema)
def login(request: schemas.requestdetails, db: Session = Depends(get_session)):
    user = db.query(User).filter(User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email")
    hashed_pass = user.password
    if not verify_password(request.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    
    access=create_access_token(user.id)
    refresh = create_refresh_token(user.id)

    token_db = models.TokenTable(user_id=user.id,  access_token=access,  refresh_token=refresh, status=True)
    db.add(token_db)
    db.commit()
    db.refresh(token_db)
    return {
        "access_token": access,
        "refresh_token": refresh,
    }

@app.get('/getusers')
def getusers( dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    user = session.query(models.User).all()
    return user

@app.get('/getuserdetails')
def getusers(dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    token=dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']
    user = session.query(models.User).filter(models.User.id == user_id).first()
    print("user",user)
    return {"id": user.id, "username": user.username, "email": user.email}

@app.post('/logout')
def logout(dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    token=dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']
    token_record = db.query(models.TokenTable).all()
    info=[]
    for record in token_record:
        print("record",record)
        record_created_date_utc = record.created_date.replace(tzinfo=pytz.utc)
        if (datetime.now(pytz.utc) - record_created_date_utc).days > 1:
            info.append(record.user_id)
    if info:
        existing_token = db.query(models.TokenTable).where(TokenTable.user_id.in_(info)).delete()
        db.commit()
        
    existing_token = db.query(models.TokenTable).filter(models.TokenTable.user_id == user_id, models.TokenTable.access_token==token).first()
    if existing_token:
        existing_token.status=False
        db.add(existing_token)
        db.commit()
        db.refresh(existing_token)
    return {"message":"Logout Successfully"} 

def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
    
        payload = jwt.decode(kwargs['dependencies'], JWT_SECRET_KEY, ALGORITHM)
        user_id = payload['sub']
        data= kwargs['session'].query(models.TokenTable).filter_by(user_id=user_id,access_token=kwargs['dependencies'],status=True).first()
        if data:
            return func(kwargs['dependencies'],kwargs['session'])
        
        else:
            return {'msg': "Token blocked"}
        
    return wrapper



@app.get('/get_active_users')
async def get_active_users(
    dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)
):
    user_ids = list(manager.active_connections.keys())
    print("user_ids??",user_ids)
    # users = db.query(User).options(exclude_properties=[User.password]).filter(User.id.in_(userids)).all()
    users = db.execute(
        select(
            User.id,
            User.username,
            User.email
        ).where(User.id.in_(user_ids))
    ).fetchall()
    print("users!!",users)
    users_json = [
        {
            "id": str(user[0]),
            "username": user[1],
            "email": user[2]
        }
        for user in users
    ]
    print("users_json",users_json)
    return users_json

@app.get("/chat_history/{user1}/{user2}")
def get_chat_history(user1: str, user2: str, dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    chat_history = db.query(models.Conversation).filter(
        ((models.Conversation.sender_id == user1) & (models.Conversation.receiver_id == user2)) |
        ((models.Conversation.sender_id == user2) & (models.Conversation.receiver_id == user1))
    ).all()
    if not chat_history:
        raise HTTPException(status_code=404, detail="Chat history not found")
    return chat_history



def get_username_by_id(user_id: int,db: Session):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.username