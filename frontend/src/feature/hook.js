import { getListTask } from "@/services/tasksServices";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useFetchListTask = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getListTask());
    }, [dispatch]);
};
export const useListTask = () => {
    const listPost = useSelector((state) => state.tasks.list);
    return listPost;
};
