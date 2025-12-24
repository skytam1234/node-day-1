import { createServer } from "node:http";
import { readDB, writeDB } from "./ultils/jsonDB.js";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let taskId = 1;
let db = {};
(async () => {
    db = await readDB();
})();
function findIdMax() {
    if (!db.tasks || db.tasks.length === 0) {
        return 1;
    }
    let max = db.tasks[0].id;
    db.tasks.forEach((element) => {
        if (element.id >= max) max = element.id;
    });
    return max + 1;
}
const port = 3000;
const allowOrigin = ["http://localhost:5173", "https://skytam1234.github.io"];
function serverResponse(req, res, data) {
    const allow = allowOrigin.find(
        (item) =>
            item.toLocaleLowerCase() === req.headers.origin.toLocaleLowerCase()
    );
    const config = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };
    if (allow) {
        config["Access-Control-Allow-Origin"] = allow;
    }
    res.writeHead(data.status, config);
    res.end(JSON.stringify(data));
}

const server = createServer((req, res) => {
    let response = {
        status: 200,
    };

    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,PATCH,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        });
        res.end();
        return;
    }

    if (req.method === "GET" && req.url === "/api/tasks") {
        response.data = db.tasks;
        serverResponse(req, res, response);
        return;
    }

    if (req.method === "GET" && req.url.startsWith("/api/tasks")) {
        const id = +req.url.split("/").pop();
        const task = db.tasks.find((_task) => _task.id === id);
        if (task) {
            response.data = task;
        } else {
            response.status = 404;
            response.message = "Resource not found";
        }
        serverResponse(req, res, response);
        return;
    }

    if (req.method === "POST" && req.url.startsWith("/api/tasks")) {
        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            const payload = JSON.parse(body);
            const id = findIdMax();
            console.log(id);

            const newStask = {
                id: id,
                title: payload.title,
                isCompleted: false,
            };
            if (!db.tasks) {
                db.tasks = [];
            }
            db.tasks.push(newStask);
            writeDB(db);
            response.status = 201;
            response.data = newStask;
            serverResponse(req, res, response);
        });
        return;
    }

    if (req.method === "PUT" && req.url.startsWith("/api/tasks")) {
        let body = "";
        const id = +req.url.split("/").pop();
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            try {
                const { title, isCompleted } = JSON.parse(body);
                if (title === undefined || isCompleted === undefined) {
                    response.status = 400;
                    response.message = "Both title and completed required";
                    serverResponse(req, res, response);
                    return;
                }
                const task = db.tasks.find((_task) => _task.id === id);
                if (!task) {
                    response.status = 404;
                    response.message = "Task not found";
                    serverResponse(req, res, response);
                    return;
                }
                task.title = title;
                task.isCompleted = isCompleted;
                writeDB(db);

                response.status = 200;
                response.data = task;
                serverResponse(req, res, response);
                return;
            } catch (error) {
                response.status = 400;
                response.message = "Invalid JSON";
                serverResponse(req, res, response);
                return;
            }
        });
        return;
    }

    if (req.method === "PATCH" && req.url.startsWith("/api/tasks")) {
        let body = "";
        const id = +req.url.split("/").pop();
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            try {
                const { title, isCompleted } = JSON.parse(body);
                const task = db.tasks.find((_task) => _task.id === id);
                if (!task) {
                    response.status = 404;
                    response.message = " Task not found";
                    serverResponse(req, res, response);
                }
                if (title !== undefined) task.title = title;
                if (isCompleted !== undefined) task.isCompleted = isCompleted;
                response.status = 200;
                response.data = task;
                writeDB(db);
                serverResponse(req, res, response);
                return;
            } catch (error) {
                response.status = 400;
                response.message = "Invalid JSON";
                serverResponse(req, res, response);
                return;
            }
        });
        return;
    }

    if (req.method === "DELETE" && req.url.startsWith("/api/tasks")) {
        const id = +req.url.split("/").pop();
        const index = db.tasks.findIndex((_task) => _task.id === id);
        if (index === -1) {
            (response.status = 404), (response.message = "Task not found");
            serverResponse(req, res, response);
            return;
        }
        const task = db.tasks.splice(index, 1)[0];
        response.status = 200;
        response.data = task;
        writeDB(db);
        serverResponse(req, res, response);
        return;
    }
    if (req.url.includes("/bypass-cors")) {
        const fullUrl = new URL(req.url, `http://${req.headers.host}`);
        const queryParams = fullUrl.searchParams;
        const targetUrl = queryParams.get("url");

        if (!targetUrl) {
            response.status = 400;
            response.message = "Missing url parameter";
            serverResponse(req, res, response);
            return;
        }
        let body = "";
        req.on("data", (buffer) => {
            body += buffer.toString();
        });
        req.on("end", () => {
            const options = {
                method: req.method,
            };
            if (!["GET", "HEAD"].includes(req.method) && body) {
                options.body = body;
            }
            fetch(targetUrl, options)
                .then((res) => {
                    const isJson = res.headers
                        .get("Content-Type")
                        ?.includes("application/json");

                    return isJson ? res.json() : res.text();
                })
                .then((resuilt) => {
                    response.status = 200;
                    response.data = resuilt.data;
                    console.log(response);
                    return serverResponse(req, res, response);
                })
                .catch((error) => {
                    response.status = 400;
                    response.message = "Invalid server";
                    console.log(error);

                    return serverResponse(req, res, response);
                });
        });

        return;
    }
    console.log(req.url);

    serverResponse(req, res, {
        status: 200,
        data: "ok",
    });
});

server.listen(port, "127.0.0.1", () => {
    console.log(`Listen on 127.0.0.1:${port}`);
});
