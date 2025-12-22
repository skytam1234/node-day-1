import http from "@/utils/http";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getListTask = createAsyncThunk("tasks/getListTask", async () => {
    const path = "api/tasks";
    const res = await http.get(encodeURI(path));
    console.log(res);
    return res.data;
});
export const postTask = async (data) => {
    const path = "api/tasks";
    const res = await http.post(path, data);
    return res.data;
};
export const delTask = async (id) => {
    const path = "api/tasks/" + id;
    const res = await http.del(path);
    return res.data;
};
export const statusTask = async (id, data) => {
    const path = "api/tasks/" + id;

    const res = await http.patch(path, data);
    return res.data;
};
