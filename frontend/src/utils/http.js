import axios from "axios";

//const baseURL = import.meta.env.VITE_BASE_API;
export const baseURL = "http://localhost:3000/";

export const httpClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const get = async (path, config) => {
    const res = await httpClient.get(path, config);
    return res.data;
};

const post = async (path, data, config) => {
    const res = await httpClient.post(path, data, config);
    return res.data;
};

const put = async (path, data, config) => {
    const res = await httpClient.put(path, data, config);
    return res.data;
};

const patch = async (path, data, config) => {
    const res = await httpClient.patch(path, data, config);
    return res.data;
};
const del = async (path, config) => {
    const res = await httpClient.delete(path, config);
    return res.data;
};

const http = { get, post, put, patch, del };

export default http;
