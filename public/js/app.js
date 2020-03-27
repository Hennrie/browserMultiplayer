window.addEventListener("load", () => {
  resize();
  // Resizes the canvas once the window loads
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mousemove", sketch);
  canvas.addEventListener("mouseleave", stopPainting);
  readyBtn.addEventListener("click", userIsReady);

  window.addEventListener("resize", resize);

  document.getElementById("clearBtn").addEventListener("click", clearDrawPanel);
});
const body = document.querySelector("body");
const canvas = document.querySelector("#drawArea");
const readyBtn = document.getElementById("ready-btn");

let rect;
// Context for the canvas for 2 dimensional operations
const ctx = canvas.getContext("2d");

function clearDrawPanel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Resizes the canvas to the available size of the window.
function resize() {
  rect = canvas.getBoundingClientRect();

  ctx.canvas.width = rect.width;
  ctx.canvas.height = rect.height;
}

// Stores the initial position of the cursor
let coord = { x: 0, y: 0 };

// This is the flag that we are going to use to
// trigger drawing
let paint = false;

// Updates the coordianates of the cursor when
// an event e is triggered to the coordinates where
// the said event is triggered.
function getPosition(event) {
  /* rect = canvas.getBoundingClientRect(); */
  coord.x = event.clientX - rect.left;
  coord.y = event.clientY - rect.top;
}

// The following functions toggle the flag to start
// and stop drawing
function startPainting(event) {
  paint = true;
  getPosition(event);
}
function stopPainting() {
  paint = false;
}

function sketch(event) {
  if (!paint) return;
  ctx.beginPath();

  ctx.lineWidth = 5;

  // Sets the end of the lines drawn
  // to a round shape.
  ctx.lineCap = "round";

  ctx.strokeStyle = "black";

  // The cursor to start drawing
  // moves to this coordinate
  ctx.moveTo(coord.x, coord.y);

  // The position of the cursor
  // gets updated as we move the
  // mouse around.
  getPosition(event);

  // A line is traced from start
  // coordinate to this coordinate
  ctx.lineTo(coord.x, coord.y);

  // Draws the line.
  ctx.stroke();
}

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".messages-container");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit("joinRoom", { username, room });

//Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//User clicked ready
function userIsReady() {
  socket.emit("userIsReady");
}

//Message from server
socket.on("message", message => {
  /*  console.log(message); */
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit("chatMessage", msg);

  //CLear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Outpout message to DOM
function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".messages-container").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Add users to ROM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}<li>`).join("")}
  `;
}

//// User ready check
