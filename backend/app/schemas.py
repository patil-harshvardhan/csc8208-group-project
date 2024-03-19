from pydantic import BaseModel
import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    public_key: str
    
class requestdetails(BaseModel):
    email:str
    password:str
        
class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str

class changepassword(BaseModel):
    email:str
    old_password:str
    new_password:str

class TokenCreate(BaseModel):
    user_id:str
    access_token:str
    refresh_token:str
    status:bool
    created_date:datetime.datetime

class MsgCreate(BaseModel):
    sender_id : str
    receiver_id : str
    msg_content : str
    session_id : str


class MsgRetrive(BaseModel):
    receiver_id : str
