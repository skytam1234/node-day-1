import { useForm } from "react-hook-form";
import { useFetchListTask, useListTask } from "./feature/hook";
import { useDispatch } from "react-redux";
import { delTask, postTask, statusTask } from "./services/tasksServices";
import {
    addTaskToList,
    removeTask,
    updateListContent,
} from "./feature/taskSlice";
import { useEffect } from "react";

function App() {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
        },
    });
    useEffect(() => {
        fetch(
            "http://localhost:3000/bypass-cors?url=https://api-gateway.fullstack.edu.vn/api/analytics"
        )
            .then((res) => res.json())
            .then((res) => console.log(res));
    }, []);
    useFetchListTask();
    const listTask = useListTask();
    const submit = async (data) => {
        const payload = {
            title: data.title,
            isCompleted: false,
        };
        const res = await postTask(payload);
        dispatch(addTaskToList(res));
        resetField("title");
    };
    const handleDel = async (id) => {
        const res = await delTask(id);
        dispatch(removeTask(id));
    };
    const handleCheck = async (id, currentStatus) => {
        const status = !currentStatus;

        const res = await statusTask(id, {
            isCompleted: status,
        });

        const payload = {
            id: id,
            isCompleted: res.isCompleted,
        };
        console.log(payload);
        dispatch(updateListContent(payload));
    };
    return (
        <>
            <div className=" w-screen h-screen flex items-center justify-center ">
                <div className="w-100  bg-white border shadow rounded-t-2xl mx-auto flex flex-col items-center">
                    <div className="p-2 ">
                        <form
                            className="flex gap-4"
                            onSubmit={handleSubmit(submit)}
                        >
                            <input
                                type="text"
                                className="flex-1 border p-2 rounded-2xl "
                                {...register("title")}
                            />
                            <button
                                type="submit"
                                className="w-20 h-10 rounded-2xl bg-amber-300 hover:bg-amber-300/50"
                            >
                                Thêm
                            </button>
                        </form>
                    </div>
                    <h2 className="text-xl font-semibold mb-4">
                        Danh sách công việc
                    </h2>
                    <div className="w-full h-100 flex items-center justify-center">
                        <div className="p-2 bg-gray-300 w-90 h-90 overflow-auto rounded-2xl">
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="w-32 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Hoàn thành
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Tiêu đề
                                        </th>
                                        <th className="w-28 px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Xóa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    id="tableBody"
                                    className="divide-y divide-gray-200"
                                >
                                    {listTask?.map((task) => (
                                        <tr key={task.id}>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    checked={task.isCompleted}
                                                    onChange={() => {
                                                        handleCheck(
                                                            task.id,
                                                            task.isCompleted
                                                        );
                                                    }}
                                                />
                                            </td>
                                            {task?.isCompleted ? (
                                                <td className="px-4 py-2 line-through">
                                                    {task.title}
                                                </td>
                                            ) : (
                                                <td className="px-4 py-2">
                                                    {task.title}
                                                </td>
                                            )}

                                            <td className="px-4 py-2">
                                                <button
                                                    className="delete-btn bg-red-50 text-red-700 px-3 py-1.5 rounded-md border border-red-200 hover:bg-red-100"
                                                    onClick={() => {
                                                        handleDel(task.id);
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
