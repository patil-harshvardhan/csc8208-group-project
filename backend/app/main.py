from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Dict, List
import json
import base64
# from cryptography.fernet import Fernet
import redis

app = FastAPI()

# key = Fernet.generate_key()
# fernet = Fernet(key)

class Message(BaseModel):
    sender: str
    recipient: str
    message: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
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
        else:
            offline_messages.lpush(message.recipient, json.dumps(message.dict())) # remove await here, redis originally is sync
            

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    print("user_id: ", user_id)
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = Message(**json.loads(data))
            await manager.send_personal_message(message)
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

@app.get("/items")
async def read_items(item_id: str):
    return "Hello there"
    # offline_messages.close()
    # await offline_messages.wait_closed()

# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run(app, host="0.0.0.0", port=8080)

