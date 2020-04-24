/* const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const socket = io();

window.addEventListener("load", () => {
  console.log(socket.username);
});

const currentUserName = urlParams.get("username");
 */
const userList = document.getElementById("users");
const socket = io("/lobby");

socket.on("roomDetails", ({ rooms }) => {
  outputRoomDetails(rooms);
  /* outputUsers(users); */
});

//render all roomDetails
function outputRoomDetails(rooms) {
  rooms.forEach(function (element) {
    const div = document.createElement("div");
    div.classList.add("lobby-details");
    div.innerHTML += `<li> <span>Room name: ${element.roomName}</span></li>
        <li><span>Number of players: ${element.playerCount}/${element.playerMaxCount}</span></li>
        <li><span>Status: ${element.status}</span></li>`;
    document.querySelector(".lobby-container").appendChild(div);
  });
  // get all rendered rooms and attach a click listener to them
  const roomList = document.querySelectorAll(".lobby-container div");
  roomList.forEach((item, index) => {
    item.addEventListener("click", () => {
      joinRoom(rooms[index]);
    });
  });
}

function joinRoom(room) {
  socket.emit("joinRoom", { currentUserName, room });

  console.log(room.roomName);
}

function outputUsers(users) {
  userList.innerHTML += `
    ${users.map((user) => `<li>${user.username}<li>`).join("")}
  `;
}
