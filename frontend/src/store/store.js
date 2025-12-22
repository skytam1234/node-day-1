import { taskSlice } from "@/feature/taskSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        [taskSlice.reducerPath]: taskSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const reduxStore = { store };
