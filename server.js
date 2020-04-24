const http = require("http");
const io = require("socket.io")();
const express = require("express");
const formatMessage = require("./utils/message");
const {
  getUsersArray,
  userJoin,
  setReady,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isUsernameAvailable,
} = require("./utils/user");

const { newRoom, getRoomArray } = require("./utils/rooms");

const app = express();
const server = http.createServer(app);
const botName = "ChatBot";

io.attach(server);
//Set static folder
app.use(express.static(__dirname + "/public"));

const nspLogin = io.of("/login");

nspLogin.on("connection", function (socket) {
  console.log("user connected to login");
  socket.on("loginRequest", (username) => {
    if (!isUsernameAvailable(username)) {
      userJoin(socket.id, username, "lobby", false);
      socket.emit("loginSuccessed");
    } else socket.emit("loginFailed");
  });
});

const nspLobby = io.of("/lobby");
//Run when client connect to lobby
nspLobby.on("connection", function (socket) {
  console.log("a user connected to lobby!");

  //send roomDetails signal with roomArray data
  socket.emit(
    "roomDetails",
    { rooms: getRoomArray() },
    { users: getRoomUsers() }
  );

  //listen for joining user and get user data

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room.roomName, false);
    console.log("user " + username + " has joined room " + room.roomName);
    socket.join(user.room);

    //Welcome new user
    socket.emit("message", formatMessage(botName, "Welcome to my playground!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for readyisReady
  socket.on("userIsReady", () => {
    setReady(socket.id);
  });

  //Listen for chatMesssage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Listen for user drawing
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));

  //Runs when client disconnects
  /* socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    console.log("user disconnected!");

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  }); */
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
