import { useState } from "react";
import { DeletedMessage, FileMessage, HiddenMessage, NormalMessgae } from "./messagesubcomponents";

const MessageComponent = ({ onDelete, data }) => {  
  return (
    <div className="chat-message my-2">
      {data.msg_type === "file" ?
      <FileMessage data={data} onDelete={onDelete}  key={data.msg_id}/>
      :
      data.msg_type === "delete_msg" ?
      <DeletedMessage data={data} onDelete={onDelete} key={data.msg_id} />
      :
      data.msg_type ==="hidden_msg"?
      <HiddenMessage data={data} onDelete={onDelete}/>
      :
      <NormalMessgae data={data} onDelete={onDelete} key={data.msg_id} />
      }
    </div>
  );
};

export default MessageComponent;
