import { useState } from "react";
import MessageComponent from "./message";

const RightPanel = ({ ws, selectedUser, userDetails }) => {
  const [msg, setMsg] = useState("");
  const sendMessage = () => {
    ws.send(JSON.stringify({
      message: "Hello",
      recipient: selectedUser.id,
      sender: userDetails.id,
      sessionId: "testId",
      typee: "publicKey",
    }));
    setMsg("");
  };

  ws.onmessage = (event) => {
    console.log(event.data);
  }
  return (
    <div className="w-3/4 p-4 flex flex-col items-end">
      <h1 className="text-lg font-bold mb-4">Conversations</h1>
      <div className="bg-white rounded-lg shadow-md p-4 w-full h-full">
        <MessageComponent
          message="It seems like you are from Mac OS world. There is no /Users/ folder on linux ?"
          sender={false}
        />
        <MessageComponent
          message="yes, I have a mac. I never had issues with root permission as well, but this helped me to solve the problem"
          sender={true}
        />
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
