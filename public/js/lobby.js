const roomList = document.querySelectorAll(".lobby-container div");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const socket = io();

window.addEventListener("load", () => {
  roomList.forEach((item) => {
    item.addEventListener("click", joinRoom);
  });
});

socket.username = urlParams.get("username");

socket.on("roomDetails", ({ rooms }) => {
  outputRoomDetails(rooms);
});

//render all roomDetails
function outputRoomDetails(rooms) {
  rooms.forEach(function (element) {
    const div = document.createElement("div");
    div.classList.add("lobby-details");
    div.innerHTML += `<li> <span>Room name: ${element.roomName}</span></li>
    <li><span>Number of players: ${element.playerCount}</span></li>
    <li><span>Status: ${element.status}</span></li>`;
    document.querySelector(".lobby-container").appendChild(div);
  });
}

function joinRoom() {
  console.log("jo");
}
