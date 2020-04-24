"use strict";

window.addEventListener("load", () => {
  window.addEventListener("resize", onResize, false);
  onResize();
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mouseup", onMouseUp, false);
  canvas.addEventListener("mouseout", onMouseUp, false);
  canvas.addEventListener("mousemove", () => {
    throttle(onMouseMove, 10), false;
  });

  //Touch support for mobile devices
  canvas.addEventListener("touchstart", onMouseDown, false);
  canvas.addEventListener("touchend", onMouseUp, false);
  canvas.addEventListener("touchcancel", onMouseUp, false);
  canvas.addEventListener("touchmove", () => {
    throttle(onMouseMove, 10), false;
  });

  paintBrushSizes.forEach((item) => {
    item.addEventListener("click", setBrushWidth);
  });
  document.getElementById("clearBtn").addEventListener("click", clearDrawPanel);
});

const socket = io();

/* var colors = document.getElementsByClassName('color'); */

const canvas = document.querySelector("#drawArea");
var context = canvas.getContext("2d");
const readyBtn = document.getElementById("ready-btn");
const paintBrushSizes = document.querySelectorAll(".lineWidth-panel div");

var current = {
  x: 0,
  y: 0,
};
var rect;
var lineWidth = 5;

/*  var current = {
    color: 'black'
  }; */
var drawing = false;

/* for (var i = 0; i < colors.length; i++) {
  colors[i].addEventListener("click", onColorUpdate, false);
} */

// handle drawing signal form server
socket.on("drawing", onDrawingEvent);

// Context for the canvas for 2 dimensional operations

function clearDrawPanel() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function setBrushWidth(event) {
  /* if (event.target !== this) {
    return;
  } else {
  } */
  lineWidth = event.target.offsetWidth;
  console.log(event.target.offsetWidth);
}

function drawLine(x0, y0, x1, y1, lineWidth, emit) {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = "black";
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.stroke();
  context.closePath();

  if (!emit) {
    return;
  }
  var w = canvas.width;
  var h = canvas.height;

  socket.emit("drawing", {
    x0: x0 / w,
    y0: y0 / h,
    x1: x1 / w,
    y1: y1 / h,
    lineWidth: lineWidth,
  });
}

function onMouseDown(e) {
  drawing = true;
  rect = canvas.getBoundingClientRect();
  current.x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
  current.y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
}

function onMouseUp(e) {
  if (!drawing) {
    return;
  }
  drawing = false;
  drawLine(
    current.x,
    current.y,
    e.clientX - rect.left || e.touches[0].clientX - rect.left,
    e.clientY - rect.top || e.touches[0].clientY - rect.top,
    lineWidth,
    true
  );
}

function onMouseMove(e) {
  if (!drawing) {
    return;
  }
  drawLine(
    current.x,
    current.y,
    e.clientX - rect.left || e.touches[0].clientX - rect.left,
    e.clientY - rect.top || e.touches[0].clientY - rect.top,
    lineWidth,
    true
  );
  current.x = e.clientX - rect.left || e.touches[0].clientX - rect.left;
  current.y = e.clientY - rect.top || e.touches[0].clientY - rect.top;
}

/* function onColorUpdate(e) {
  current.color = e.target.className.split(" ")[1];
} */

// limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function () {
    var time = new Date().getTime();

    if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

function onDrawingEvent(data) {
  var w = canvas.width;
  var h = canvas.height;
  drawLine(
    data.x0 * w,
    data.y0 * h,
    data.x1 * w,
    data.y1 * h,
    data.lineWidth,
    false
  );
}

// make the canvas fill its parent
function onResize() {
  rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

/* ##################################

Chat logic


 ##################################*/

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".messages-container");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
/* const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
}); */

//Join chatroom
/* socket.emit("joinRoom", { username, room }); */

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
socket.on("message", (message) => {
  /*  console.log(message); */
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener("submit", (e) => {
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
  roomName.innerText += " " + room;
}

//Add users to ROM
function outputUsers(users) {
  userList.innerHTML += `
    ${users.map((user) => `<li>${user.username}<li>`).join("")}
  `;
}

//// User ready check
