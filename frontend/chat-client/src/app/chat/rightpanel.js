import { useEffect, useState } from "react";
import MessageComponent from "./message";
import axiosInstance from "../axios";
import { JSEncrypt } from "jsencrypt";
import {v4 as uuidv4} from 'uuid'

const RightPanel = ({ ws, selectedUser, userDetails }) => {
  const [msg, setMsg] = useState("");
  const [userMsgs, setUserMsgs] = useState([]);
  let crypt = new JSEncrypt();
  crypt.setPublicKey(selectedUser.public_key);
  
  let crypt2 = new JSEncrypt();
  crypt2.setPublicKey(userDetails.public_key);
  crypt2.setPrivateKey(localStorage.getItem("private_key"));

  

  const onDelete = async (id) => {
    const res = await axiosInstance.get(`/delete_msg/${id}`);
    if (res.status === 200) {
      console.log(userMsgs)
      console.log(userMsgs.filter((msg) => msg.msg_id !== id))
      setUserMsgs(userMsgs.filter((msg) => msg.msg_id !== id));
      const message_payload ={
        msg_type: "delete_msg",
        sender_id: userDetails.id,
        receiver_id: selectedUser.id,
        msg_content_sender_encrypted: crypt2.encrypt(id),  
        msg_content_receiver_encrypted: crypt.encrypt(id),
        msg_id: uuidv4()
      }
      ws.send(
        JSON.stringify(message_payload)
      )
    }
  }

  const sendMessage = () => {
    const msg_content_receiver_encrypted = crypt.encrypt(msg);
    const msg_content_sender_encrypted = crypt2.encrypt(msg);
    // generate a UUID for the message
    const msg_id = uuidv4();
    const message_payload ={
      msg_type: "msg",
      sender_id: userDetails.id,
      receiver_id: selectedUser.id,
      msg_content_sender_encrypted: msg_content_sender_encrypted,
      msg_content_receiver_encrypted: msg_content_receiver_encrypted,
      msg_id
    }
    ws.send(
      JSON.stringify(message_payload)
    );

    setMsg("");
    setUserMsgs([...userMsgs, { sender: true, message: msg ,...message_payload}]);
  };

  ws.onmessage = (event) => {
    console.log(event.data);
    const data = JSON.parse(event.data);
    if (selectedUser.id === data.sender_id) {

      const message = crypt2.decrypt(data.msg_content_receiver_encrypted);
      console.log(message,userMsgs.filter((msg) => msg.msg_id !== message))
      if(data.msg_type === "delete_msg"){
        setUserMsgs([...userMsgs.filter((msg) => msg.msg_id !== message), { sender: false, message: message, ...data }]);
      }
      else
      setUserMsgs([...userMsgs, { sender: false, message: message, ...data }]);
    }
  };

  const getChatHistory = async () => {
    const res = await axiosInstance.get(
      `/chat_history/${selectedUser.id}/${userDetails.id}`
    );
    if (res.status === 200) {
      console.log(res.data);
      const msgs = res.data.map((msg) => {
        const sender = msg.sender_id === userDetails.id ? true : false
        let crypt = new JSEncrypt();
        crypt.setPrivateKey(localStorage.getItem("private_key"));
        const message = crypt.decrypt(sender ? msg.msg_content_sender_encrypted : msg.msg_content_receiver_encrypted);
        return {
          message: message ,
          sender: sender,
          ...msg
        };
      });
      setUserMsgs(msgs);
    }
  };
  useEffect(() => {
    setUserMsgs([]);
    setMsg("");
    if (selectedUser) {
      getChatHistory();
    }
  }, [selectedUser]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-3/4 p-4 flex flex-col items-end">
      <h1 className="text-lg font-bold mb-4">Conversations</h1>
      <div className="bg-white rounded-lg shadow-md p-4 w-full h-full overflow-y-auto">
        {userMsgs.map((msg) => (
          <MessageComponent message={msg.message} sender={msg.sender} key={msg.msg_id} onDelete={onDelete} msg_id={msg.msg_id} data={msg}/>
        ))}
      </div>
      {/* here */}
      <div className="mt-4 flex items-center justify-between w-full">
        <input
          type="text"
          placeholder="Type a message..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-3/4 focus:outline-none focus:border-blue-500"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
