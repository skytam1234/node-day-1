import axios from "axios";

//const baseURL = import.meta.env.VITE_BASE_API;
export const baseURL = "http://localhost:3000/";

export const httpClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Ví dụ: get('/users') -> lấy danh sách users
const get = async (path, config) => {
    const res = await httpClient.get(path, config);
    return res.data;
    // null vì GET không gửi data trong body
};

// Hàm POST: tạo mới dữ liệu
// Ví dụ: post('/users', { name: 'John' }) -> tạo user mới
const post = async (path, data, config) => {
    const res = await httpClient.post(path, data, config);
    return res.data;
};

// Hàm PUT: cập nhật toàn bộ dữ liệu
// Ví dụ: put('/users/1', { name: 'John', age: 30 }) -> cập nhật user id=1
const put = async (path, data, config) => {
    const res = await httpClient.put(path, data, config);
    return res.data;
};

// Hàm PATCH: cập nhật một phần dữ liệu
// Ví dụ: patch('/users/1', { age: 31 }) -> chỉ cập nhật tuổi
const patch = async (path, data, config) => {
    const res = await httpClient.patch(path, data, config);
    return res.data;
};

// Hàm DELETE: xóa dữ liệu
// Ví dụ: del('/users/1') -> xóa user id=1
const del = async (path, config) => {
    const res = await httpClient.delete(path, config);
    return res.data;
    // null vì DELETE không gửi data trong body
};

const http = { get, post, put, patch, del };

export default http;
