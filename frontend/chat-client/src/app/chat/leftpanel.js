
const LeftPanel = ({users,setSelectedUser,userDetails,selectedUser}) => {
    return (
        <div className="bg-gray-200 h-full w-1/4 p-4">
                <h1 className="text-lg font-bold mb-4">People</h1>
                <ul>
                  {users.map((user) => (
                    <li
                      className={`flex items-center py-2 hover:bg-gray-300 cursor-pointer rounded-lg p-2 my-2 ${selectedUser &&(selectedUser.id === user.id) ? "bg-gray-300" : ""}`}
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                    >
                      {/* <img
                        src="https://via.placeholder.com/40"
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2"
                      /> */}
                      <span className="font-semibold">
                        {user.email} {userDetails.id === user.id ? "(You)" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
    );
}

export default LeftPanel;