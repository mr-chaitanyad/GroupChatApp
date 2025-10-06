const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../frontend")));

io.on("connection", (socket) => {
  console.log("🟢 New user connected");

  socket.on("new_user", (username) => {
    socket.username = username;
    io.emit("receive_message", { username: "System", message: `🟢 ${username} joined the chat` });
  });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("receive_message", { username: "System", message: `🔴 ${socket.username} left the chat` });
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
