import { useEffect, useState } from "react";
import MessageComponent from "./message";
import axiosInstance from "../axios";

const RightPanel = ({ ws, selectedUser, userDetails }) => {
  const [msg, setMsg] = useState("");
  const [userMsgs, setUserMsgs] = useState([]);

  const sendMessage = () => {
    ws.send(JSON.stringify({
      message: msg,
      recipient: selectedUser.id,
      sender: userDetails.id,
      sessionId: "testId",
      typee: "publicKey",
    }));
    setMsg("");
    setUserMsgs([...userMsgs, {sender:true, message:msg}]);
  };

  ws.onmessage = (event) => {
    console.log(event.data);
    const data = JSON.parse(event.data);
    if (selectedUser.id === data.sender) {
        setUserMsgs([...userMsgs, {sender:false, message:data.message}]);
    }
  }

  const getChatHistory = async () => {
    const res = await axiosInstance.get(`/chat_history/${selectedUser.id}/${userDetails.id}`);
    if (res.status === 200) {
        console.log(res.data);
        const msgs = res.data.map((msg) => {
            return {
                message: msg.msg_content,
                sender: msg.sender_id === userDetails.id ? true : false,
            }
        })
        setUserMsgs(msgs)
    }
    }
    useEffect(() => {
        setUserMsgs([]);
        setMsg("");
        if (selectedUser) {
            getChatHistory();
        }
    }, [selectedUser]);

  return (
    <div className="w-3/4 p-4 flex flex-col items-end">
      <h1 className="text-lg font-bold mb-4">Conversations</h1>
      <div className="bg-white rounded-lg shadow-md p-4 w-full h-full">
        {userMsgs.map((msg) => (
            <MessageComponent message={msg.message} sender={msg.sender} />
            ))}
      </div>
      {/* here */}
      <div class="mt-4 flex items-center justify-between w-full">
        <input
          type="text"
          placeholder="Type a message..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-3/4 focus:outline-none focus:border-blue-500"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
