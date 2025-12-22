import { getListTask } from "@/services/tasksServices";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};
export const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTaskToList: (state, action) => {
            console.log(action.payload);
            state.list.push(action.payload);
        },
        removeTask: (state, action) => {
            const id = action.payload;
            state.list = state.list.filter((task) => task.id !== id);
        },

        updateListContent: (state, action) => {
            const { id, isCompleted } = action.payload;
            const task = state.list.find((_task) => _task.id === id);
            task.isCompleted = isCompleted;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getListTask.fulfilled, (state, action) => {
            state.list = action.payload;
        });
    },
});
export const { addTaskToList, removeTask, updateListContent } =
    taskSlice.actions;
