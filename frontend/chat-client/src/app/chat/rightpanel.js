import { useEffect, useState } from "react";
import MessageComponent from "./message";
import axiosInstance from "../axios";
import { JSEncrypt } from "jsencrypt";
import {v4 as uuidv4} from 'uuid'

const RightPanel = ({ ws, selectedUser, userDetails }) => {
  const [msg, setMsg] = useState("");
  const [userMsgs, setUserMsgs] = useState([]);

  const sendMessage = () => {
    let crypt = new JSEncrypt();
    crypt.setPublicKey(selectedUser.public_key);
    const msg_content_receiver_encrypted = crypt.encrypt(msg);

    let crypt2 = new JSEncrypt();
    crypt2.setPublicKey(userDetails.public_key);
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
      let crypt = new JSEncrypt();
      crypt.setPrivateKey(localStorage.getItem("private_key"));
      const message = crypt.decrypt(data.msg_content_receiver_encrypted);
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
          <MessageComponent message={msg.message} sender={msg.sender} key={msg.msg_id}/>
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
