import { useEffect, useState } from "react";
import http from "./utils/http";
import { useForm } from "react-hook-form";

function App() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
        },
    });
    useEffect(() => {
        const getTask = async () => {
            const res = await http.get("api/tasks");
            setTasks(res.data);
        };
        getTask();
    }, []);
    const submit = async (data) => {
        const payload = {
            title: data.title,
            isCompleted: false,
        };
        const res = await http.post("/api/tasks", payload);
        setTasks((prev) => [...prev, res.data]);
        reset();
    };
    return (
        <>
            <div className=" w-screen h-screen flex items-center justify-center ">
                <div className="w-100  bg-white border shadow rounded-t-2xl mx-auto flex flex-col items-center">
                    <div className="p-2 ">
                        <form
                            onSubmit={handleSubmit(submit)}
                            className="flex gap-4"
                        >
                            <input
                                type="text"
                                className="flex-1 border p-2 rounded-2xl "
                                {...register("title", {
                                    required: "Vui lòng nhập tiêu đề",
                                })}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }}
                            />
                            <button className="w-20 h-10 rounded-2xl bg-amber-300 hover:bg-amber-300/50">
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
                                    {tasks.map((task) => (
                                        <tr>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                {task.title}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button className="delete-btn bg-red-50 text-red-700 px-3 py-1.5 rounded-md border border-red-200 hover:bg-red-100">
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
