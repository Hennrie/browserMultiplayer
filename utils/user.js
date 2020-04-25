const users = [];

function getUsersArray() {
  return users;
}
//Join user to chat
function userJoin(id, username, room, ready) {
  const user = { id, username, room, ready };

  users.push(user);
  console.log(users);
  return user;
}

//Set user ready
function setReady(id) {
  const user = getCurrentUser(id);
  user.ready = true;
}

//Set user room
function setRoom(name, room) {
  getCurrentUser(name).room = room;

  console.log(users);
}

//Get current user
function getCurrentUser(name) {
  return users.find((user) => user.username === name);
}

//User leaves chat
function userLeave(name) {
  const index = users.findIndex((user) => user.username === name);

  if (index !== -1) {
    console.log("user deleted");
    return users.splice(index, 1)[0];
  }
}

//Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

function isUsernameAvailable(username) {
  if (users.some((user) => user.username === username)) return true;
  else return false;
  /* return users.filter((user) => user.username === username);
} */
}

module.exports = {
  getUsersArray,
  userJoin,
  setReady,
  setRoom,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  isUsernameAvailable,
};
