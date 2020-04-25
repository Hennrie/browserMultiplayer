const http = require("http");
const io = require("socket.io")();
const express = require("express");
const formatMessage = require("./utils/message");
const {
  getUsersArray,
  userJoin,
  setReady,
  setRoom,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isUsernameAvailable,
} = require("./utils/user");

const { newRoom, getRoomArray } = require("./utils/rooms");

const app = express();
const server = http.createServer(app);
const botName = "ChatBot";
let userName = "";
let userIsActive = false;

io.attach(server);
//Set static folder
app.use(express.static(__dirname + "/public"));

const nspLogin = io.of("/login");

nspLogin.on("connection", function (socket) {
  console.log("user connected to login");
  socket.on("loginRequest", (username) => {
    if (!isUsernameAvailable(username)) {
      userName = username;
      /* userJoin(socket.id, username, "lobby", false); */
      socket.emit("loginSuccessed");
    } else socket.emit("loginFailed");
  });
});

const nspLobby = io.of("/lobby");
//Run when client connect to lobby
nspLobby.on("connection", function (socket) {
  userIsActive = true;
  console.log("a user connected to lobby!");
  if (!isUsernameAvailable(userName)) {
    userJoin(socket.id, userName, "lobby", false);
  }

  //send roomDetails signal with roomArray data
  socket.emit(
    "roomDetails",
    { rooms: getRoomArray() },
    { users: getRoomUsers() }
  );

  //listen for joining user and get user data

  socket.on("joinRoom", ({ room }) => {
    /* const user = userJoin(socket.id, room.roomName, false); */
    setRoom(socket.id, room.roomName);
    const username = getCurrentUser(socket.id).username;
    console.log("user " + username + " has joined room " + room.roomName);

    socket.join(room.roomName);

    //Welcome new user
    socket.emit("message", formatMessage(botName, "Welcome to my playground!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(room.roomName)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat`)
      );

    //Send users and room info
    io.to(room.roomName).emit("roomUsers", {
      room: room.roomName,
      users: getRoomUsers(room.roomName),
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
  socket.on("disconnect", () => {
    userIsActive = false;

    if (userIsActive === false) {
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
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
