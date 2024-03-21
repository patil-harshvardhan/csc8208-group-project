import { useState } from "react";

const MessageComponent = ({ message, sender, onDelete, msg_id, data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const DeleteButton = () => {
    return (
      <button
        className=" px-1 py-1 mx-2 bg-red-500 text-white rounded-full hover:bg-red-600"
        onClick={() => {
          onDelete(msg_id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className="chat-message my-2">
      {data.msg_type !== "delete_msg" ? (
        sender === false ? (
          <div className="flex items-end">
            <div className="flex flex-col mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                  {message}
                  {isHovered && <DeleteButton />}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-end justify-end">
              <div className="flex flex-col mx-2 order-1 items-end">
                <div>
                  <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                    {message}
                    {isHovered && <DeleteButton />}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      ) : sender == false ? (
        <div className="flex items-end">
          <div className="flex flex-col mx-2 order-2 items-start">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                <i>Deleted Msg</i>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-end">
          <div className="flex flex-col mx-2 order-1 items-end">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                <i>Deleted Msg</i>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
