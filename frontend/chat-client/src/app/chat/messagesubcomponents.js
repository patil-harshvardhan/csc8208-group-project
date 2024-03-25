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

const DownloadFileButton = ({ data }) => {
  const onDownloadClick = async () => {
    const res = await axiosInstance.post("/download-file", { file_id: data.message } , { responseType: 'blob' });
    // download file
    console.log(res);
    const medidaType = res.headers["content-type"];
    const extension = medidaType.split("/")[1];
    const fileName = data.message + "." + extension;
    console.log(fileName);
    console.log(extension);
    const url  = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return (
    <button
      className=" px-1 py-1 mx-2 bg-blue-500 text-white rounded-full hover:bg-purple-600"
      onClick={onDownloadClick}
    >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-4 h-4 inline-block"
      // onClick={onDownloadClick}
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

export { FileMessage, NormalMessgae, DeletedMessage };
