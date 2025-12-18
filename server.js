import { createServer } from "node:http";
import { buffer } from "node:stream/consumers";
let taskId = 1;
const db = {
  tasks: [],
};
function serverResponse(res, data) {
  res.writeHead(data.status, { "Content-Type": "text/plain" });
  res.end(JSON.stringify(data));
}
const server = createServer((req, res) => {
  let response = {
    status: 200,
  };
  //[Get] /api/tasks
  if (req.method === "GET" && req.url === "/api/tasks") {
    response.data = db.tasks;
    serverResponse(res, response);
    return;
  }
  //[Get] /api/tasks/1
  if (req.method === "GET" && req.url.startsWith("/api/tasks")) {
    const id = +req.url.split("/").pop();
    const task = db.tasks.find((_task) => _task.id === id);
    if (task) {
      response.data = task;
    } else {
      response.status = 404;
      response.message = "Resource not found";
    }
    serverResponse(res, response);
    return;
  }
  // [POST] /api/tasks/1
  if (req.method === "POST" && req.url.startsWith("/api/tasks")) {
    let body = "";
    req.on("data", (buffer) => {
      body += buffer.toString();
    });
    req.on("end", () => {
      const payload = JSON.parse(body);
      const newStask = {
        id: taskId++,
        title: payload.title,
        isCompleted: false,
      };
      db.tasks.push(newStask);
      response.status = 201;
      response.data = newStask;
      serverResponse(res, response);
    });
    return;
  }
  // [PUT] /api/tasks/1
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
          serverResponse(res, response);
          return;
        }
        const task = db.tasks.find((_task) => _task.id === id);
        if (!task) {
          response.status = 404;
          response.message = "Task not found";
          serverResponse(res, response);
          return;
        }
        task.title = title;
        task.isCompleted = isCompleted;
        response.status = 200;
        response.data = task;
        serverResponse(res, response);
        return;
      } catch (error) {
        response.status = 400;
        response.message = "Invalid JSON";
        serverResponse(res, response);
        return;
      }
    });
    return;
  }
  // [PACTH] /api/tasks/1
  if (req.method === "PATCH" && req.url.startsWith("/api/tasks")) {
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
          serverResponse(res, response);
        }
        if (title) task.title = title;
        if (isCompleted) task.isCompleted = isCompleted;
        response.status = 200;
        response.data = task;
        serverResponse(res, response);
        return;
      } catch (error) {
        response.status = 400;
        response.message = "Invalid JSON";
        serverResponse(res, response);
        return;
      }
    });
  }
  // [Delete] /api/tasks/1
  if (req.method === "DELETE" && req.url.startsWith("/api/tasks")) {
    const id = +req.url.split("/").pop();
    const index = db.tasks.findIndex((_task) => _task.id === id);
    if (index === -1) {
      (response.status = 404), (response.message = "Task not found");
      serverResponse(res, response);
      return;
    }
    const task = db.tasks.splice(index, 1)[0];
    response.status = 200;
    response.data = task;
    serverResponse(res, response);
    return;
  }

  serverResponse(res, {
    status: 200,
    data: "ok",
  });
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`Listen on 127.0.0.1:3000`);
});
