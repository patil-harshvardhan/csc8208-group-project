import { useState } from "react";
import axiosInstance from "../axios";
const DeleteButton = ({ data, onDelete }) => {
  return (
    <button
      className=" px-1 py-1 mx-2 bg-red-500 text-white rounded-full hover:bg-red-600"
      onClick={() => {
        onDelete(data.msg_id);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-4 h-4"
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

const SeeMsgIcon = ({onClick}) => {
  return (
    <button
      className=" px-1 py-1 mx-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
      onClick={onClick}
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
</button>
  )
}

const HideMsgIcon = ({onClick}) => {
  return (
    <button
      className=" px-1 py-1 mx-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
      onClick={onClick}
    >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" onClick={onClick}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
  </button>

  )
}

const DownloadFileButton = ({ data }) => {
  const onDownloadClick = async () => {
    try {
      const res = await axiosInstance.post(
        "/download-file",
        { file_id: data.message },
        { responseType: "blob" }
      );

      let extension = "";

      const contentType = res.headers["content-type"];
      if (contentType) {
        // Extract extension from content type
        const typeParts = contentType.split("/");
        if (typeParts.length === 2) {
          extension = typeParts[1];
        }
      }

      let fileName = `${data.message}.${extension}`;

      // Create blob and URL for download
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create link and initiate download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <button
      className="px-1 py-1 mx-2 bg-blue-400 text-white rounded-full hover:bg-blue-500"
      onClick={onDownloadClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 inline-block"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </button>
  );
};

const FileMessage = ({ data, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const message = "Download File";
  if (data.sender === false)
    return (
      <div className="flex items-end">
        <div className="flex flex-col mx-2 order-2 items-start">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
              {message}
              <DownloadFileButton data={data} />
            </span>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-end justify-end">
          <div className="flex flex-col mx-2 order-2 items-end">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white">
                {message}
                <DownloadFileButton data={data} />
                {isHovered && <DeleteButton data={data} onDelete={onDelete} />}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
};

const NormalMessgae = ({ data, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  if (data.sender === false) {
    return (
      <div className="flex items-end">
        <div className="flex flex-col mx-2 order-2 items-start">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
              {data.message}
              {isHovered && <DeleteButton data={data} onDelete={onDelete} />}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-end justify-end">
          <div className="flex flex-col mx-2 order-1 items-end">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                {data.message}
                {isHovered && <DeleteButton data={data} onDelete={onDelete} />}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const DeletedMessage = ({ data, onDelete }) => {
  return (
    <div className={`flex items-end ${data.sender && "justify-end"}`}>
      <div
        className={`flex flex-col mx-2 order-2 items-${
          data.sender ? "end" : "start"
        }`}
      >
        <div>
          <span
            className={`px-4 py-2 rounded-lg inline-block rounded-b${
              data.sender ? "r" : "l"
            }-none bg-gray-300 text-gray-600`}
          >
            <i>Deleted Msg</i>
          </span>
        </div>
      </div>
    </div>
  );
};

const HiddenMessage = ({ data, onDelete }) => {
  const [seeMsg,setSeeMsg] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  if (data.sender === false) {
    return (
      <div className="flex items-end">
        <div className="flex flex-col mx-2 order-2 items-start">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
              {seeMsg ?<>{data.message} <HideMsgIcon onClick={()=> setSeeMsg(false)}/></>  : <SeeMsgIcon onClick={()=>setSeeMsg(true)}/> }
              {isHovered && <DeleteButton data={data} onDelete={onDelete} />}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-end justify-end">
          <div className="flex flex-col mx-2 order-1 items-end">
            <div>
              <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                {seeMsg ?<>{data.message }<HideMsgIcon onClick={()=> setSeeMsg(false)}/></>  : <SeeMsgIcon onClick={()=>setSeeMsg(true)}/> }
                {isHovered && <DeleteButton data={data} onDelete={onDelete} />}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { FileMessage, NormalMessgae, DeletedMessage , HiddenMessage};
