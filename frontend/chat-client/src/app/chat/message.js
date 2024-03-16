const MessageComponent = ({ message, sender }) => {
  return (
    <>
      {sender === false ? (
        <div className="chat-message my-2">
          <div className="flex items-end">
            <div className="flex flex-col mx-2 order-2 items-start">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                  {message}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-message my-2">
          <div className="flex items-end justify-end">
            <div className="flex flex-col mx-2 order-1 items-end">
              <div>
                <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                  {message}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageComponent;
