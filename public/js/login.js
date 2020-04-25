const loginBtn = document.getElementById("login-btn");

const validPattern = /^[0-9a-zA-Z]+$/;
const socket = io("/login");

loginBtn.addEventListener("click", () => {
  event.preventDefault();
  socket.username = document.getElementById("username").value;

  if (socket.username.match(validPattern)) {
    socket.emit("loginRequest", socket.username);
  } else
    alert("Sorry! Your username should only contain letters and/or numbers");
});
socket.on("loginSuccessed", () => {
  window.location.href = "lobby.html";
});
socket.on("loginFailed", () => {
  alert("Sorry this username is already in use :(");
});
