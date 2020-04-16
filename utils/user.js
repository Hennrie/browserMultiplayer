const users = [];

//Join user to chat
function userJoin(id, username, room, ready) {
  const user = { id, username, room, ready };

  users.push(user);
  return user;
}

//Set user ready
function setReady(id) {
  const user = getCurrentUser(id);
  user.ready = true;
}

//Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  setReady,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
