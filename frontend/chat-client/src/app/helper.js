import axiosInstance from "./axios"
const startPolling = (url, callback) => {
    axiosInstance.get(url)
        .then((response) => {
            callback(response.data);
            setTimeout(() => startPolling(url, callback), 3000);
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
}

export { startPolling}
