from fastapi import Depends, FastAPI, HTTPException, status, FastAPI, WebSocket, WebSocketDisconnect, Request
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

from app.models import User, TokenTable, UserKeys, Messages
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
from sqlalchemy import Column, Integer, String, select, and_ , or_
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
    msg_id: str
    msg_type: str 
    sender_id: str
    receiver_id: str
    msg_content_sender_encrypted: str
    msg_content_receiver_encrypted: str
    def json(self):
        return {
            "msg_id": self.msg_id,
            "msg_type": self.msg_type,
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
            "msg_content_sender_encrypted": self.msg_content_sender_encrypted,
            "msg_content_receiver_encrypted": self.msg_content_receiver_encrypted
        }

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
        await r_websocket.send_text(json.dumps(message.json()))
        # await r_websocket.send_text(json.dumps({"sender": message.sender, "message": base64.b64encode(encrypted_message).decode()}))

    def disconnect(self, user_id: str):
        self.active_connections.pop(user_id)

    async def send_personal_message(self, message: Message):
        if message.receiver_id in self.active_connections:
            websocket = self.active_connections[message.receiver_id]
            await self.send(message, websocket)
            # store in DB
            
        else:
            offline_messages.lpush(message.receiver_id, json.dumps(message.dict())) # remove await here, redis originally is sync
            

manager = ConnectionManager()

# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket, dependencies=Depends(JWTBearer()),  session: Session = Depends(get_session)):
#     token = dependencies
#     print("token: ", token)
#     payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
#     user_id = payload['sub']
#     print("user_id: ", user_id)
#     await manager.connect(websocket, user_id)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             message = Message(**json.loads(data))
#             await manager.send_personal_message(message)
#             new_msg = models.Conversation(typee = "msg",sender_id = message.sender, receiver_id = message.recipient ,
#                                           sender_name=get_username_by_id(message.sender,session),receiver_name=get_username_by_id(message.recipient,session),
#                                            msg_content= message.message, session_id='0000')

#             session.add(new_msg)
#             session.commit()
#             session.refresh(new_msg) 

#     except WebSocketDisconnect:
#         manager.disconnect(user_id)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str,  session: Session = Depends(get_session)):
    print("user_id: ", user_id)
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = Message(**json.loads(data))
            await manager.send_personal_message(message)
            new_msg = Messages(sender_id = message.sender_id, receiver_id = message.receiver_id ,
                                           msg_content_sender_encrypted= message.msg_content_sender_encrypted, msg_content_receiver_encrypted = message.msg_content_receiver_encrypted,msg_type = message.msg_type, msg_id = message.msg_id)

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
def login(request: schemas.requestdetails, request1: Request, db: Session = Depends(get_session)):
    user = db.query(User).filter(User.email == request.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email")
    hashed_pass = user.password
    if not verify_password(request.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    ip  = request1.client.host
    dttect_bot = detect_botnets(user.id , ip ,db) 
    if(dttect_bot):
        raise HTTPException(status_code=403, detail="Access denied")

    access=create_access_token(user.id)
    refresh = create_refresh_token(user.id)

    token_db = models.TokenTable(user_id=user.id, ip = ip , access_token=access,  refresh_token=refresh, status=True)
    db.add(token_db)
    db.commit()
    db.refresh(token_db)
    return {
        "access_token": access,
        "refresh_token": refresh,
    }

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

# gets all the users from the database
@app.get('/getusers')
def getusers( dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    query = session.query(User, UserKeys).filter(and_(User.id == UserKeys.user_id, UserKeys.active == True))
    results = query.all()
    payload = []
    for user, keys in results:
        user_payload = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'public_key': keys.public_key
        }
        payload.append(user_payload)
    return payload

# gets all the active users from the database
@app.get('/get_active_users')
async def get_active_users(
    dependencies=Depends(JWTBearer()), session: Session = Depends(get_session)
):
    user_ids = list(manager.active_connections.keys())
    query = session.query(User, UserKeys).filter(and_(User.id == UserKeys.user_id, UserKeys.active == True, User.id.in_(user_ids)))
    results = query.all()
    payload = []
    for user, keys in results:
        user_payload = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'public_key': keys.public_key
        }
        payload.append(user_payload)
    return payload

# gets the details of the user
@app.get('/getuserdetails')
def getusers(dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    token=dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']
    user, user_keys = session.query(User,UserKeys).filter(and_(User.id == user_id,User.id == UserKeys.user_id, UserKeys.active == True)).first()
    return {"id": user.id, "username": user.username, "email": user.email , "public_key": user_keys.public_key}

# getting the chat history between two users
@app.get("/chat_history/{user1}/{user2}")
def get_chat_history(user1: str, user2: str, dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    # get_chat_history = db.query(Messages).filter(or_(Messages.sender_id == user1, Messages.receiver_id == user1, Messages.sender_id == user2, Messages.receiver_id == user2)).all()
    get_chat_history = db.query(Messages).filter(or_(and_(Messages.sender_id == user1,Messages.receiver_id == user2),and_(Messages.receiver_id == user1, Messages.sender_id == user2))).all()
    return get_chat_history

# class File(BaseModel):
#     msg_type: str 
#     sender_id: str
#     receiver_id: str
#     msg_content_sender_encrypted: str
#     msg_content_receiver_encrypted: str


from fastapi import  UploadFile
from fastapi.responses import FileResponse
from pathlib import Path
import uuid
@app.post("/upload-file")
async def upload_file(file: UploadFile, dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    token=dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']

    contents = await file.read()  # Read file content

    # Generate a unique UUID for the file ID
    file_id = str(uuid.uuid4())
    upload_dir = Path("uploads")
    save_path = upload_dir / file_id  # Use the file ID as part of the path
    save_path.parent.mkdir(parents=True, exist_ok=True)  # Create directory if it doesn't exist

    # Save the file
    with open(save_path, "wb") as f:
        f.write(contents)

    file_db = models.Files(file_id=file_id, file_type=file.content_type, sender_id=user_id, file_path=str(save_path))
    session.add(file_db)
    session.commit()
    session.refresh(file_db)

    # Insert data into your file table using your preferred database library

    return { "file_id": file_id, "file_path": str(save_path), "file_type": file.content_type, "sender_id": user_id}

class DownloadFile(BaseModel):
    file_id: str
# corresponding download file api
@app.post("/download-file")
async def download_file(file_model: DownloadFile, dependencies=Depends(JWTBearer()),session: Session = Depends(get_session)):
    print('fuck!')
    token=dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user_id = payload['sub']

    file = session.query(models.Files).filter_by(file_id=file_model.file_id).first()
    if file is None:
        raise HTTPException(status_code=404, detail="File not found")

    # Return the file 
    return FileResponse(file.file_path, media_type=file.file_type)
    # return {"file_path": file.file_path, "file_type": file.file_type}
# def get_username_by_id(user_id: int,db: Session):
#     user = db.query(models.User).filter(models.User.id == user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user.username

@app.get("/delete_msg/{msg_id}") 
def delete_message(msg_id: str, dependencies=Depends(JWTBearer()),db: Session = Depends(get_session)):
    message = db.query(models.Messages).filter(models.Messages.msg_id == msg_id).first()
    #if not message:
        #raise HTTPException(status_code=404, detail="Message not found")
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}

@app.get("/delete_chat_history/{user2}")
def delete_chat_history(user2: str, dependencies=Depends(JWTBearer()), db: Session = Depends(get_session)):
    token = dependencies
    payload = jwt.decode(token, JWT_SECRET_KEY, ALGORITHM)
    user1 = payload['sub']

    db.query(models.Messages).filter(
        ((models.Messages.sender_id == user1) & (models.Messages.receiver_id == user2)) |
        ((models.Messages.sender_id == user2) & (models.Messages.receiver_id == user1))
    ).delete()
    db.commit()

    return {"message": "Chat history deleted successfully"}

def detect_botnets(id: str , ip: str, db) -> bool:
    status = False
    # look in db same user how many ips 
   # count = db.query(func.count(TokenTable.id)).filter(TokenTable.ip_address == user_data.ip_address).scalar()
    unique_ip_count = db.query(TokenTable.ip).filter(TokenTable.user_id == id).distinct().count()
    print(f'unique_ip_count: {unique_ip_count}')
    # look for ip, how many user use this ip
    user_count = db.query(TokenTable.user_id).filter(TokenTable.ip == ip).distinct().count()
    print(f'user_count: {user_count}')
    if (unique_ip_count >2) or (user_count > 2):
        status =  True 

    return status

from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)