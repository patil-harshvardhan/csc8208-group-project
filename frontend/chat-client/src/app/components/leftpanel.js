const { default: axios } = require("../axios");

const leftpanel = () => {
    const getConverstaion = () => {
        // const conversation = axios.get
    }
    return (
        <div className="leftpanel">
        <div className="leftpanel__header">
            <h3>Chats</h3>
        </div>
        <div className="leftpanel__search">
            <input type="text" placeholder="Search" />
        </div>
        <div className="leftpanel__chats">
            {/* <Chat /> */}
        </div>
        </div>
    );
    }
export default leftpanel;