const MessageComponent = ({ message, sender }) => {
  return (
    <>
      {sender === false ? (
        <div class="chat-message">
          <div class="flex items-end">
            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                  {message}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="chat-message">
          <div class="flex items-end justify-end">
            <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
              <div>
                <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
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
