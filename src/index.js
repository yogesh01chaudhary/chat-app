import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import Filter from "bad-words";
import { generateMessage } from "./utils/messages.js";
import { generateLocationMessage } from "./utils/generateLocationMessage.js";
import { addUser, getUser, removeUser, getUsersInRoom } from "./utils/users.js";
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectoryPath = path.join(__dirname, "../public");
console.log({ publicDirectoryPath, __dirname, __filename });

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket Connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    // console.log(user);
    // console.log(error);
    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Admin", `${user.username} has joined`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (msg, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      return callback("profanity is not allowed");
    }
    io.to(user.room).emit("message", generateMessage(user.username, msg));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("sendLocation", (coords, callback) => {
    // console.log({ latitude, longitude, timestamp });
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
  // socket.emit("countUpdated", count);

  // socket.on("increment", () => {
  //   console.log("Hello from client to increase the count");
  //   count++;
  //   // socket.emit("countUpdated", count);
  //   io.emit("countUpdated", count);
  // });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
