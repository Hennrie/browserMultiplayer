let rooms = [
  //initialize 2 default rooms
  {
    roomName: "room1",
    status: "waiting for players",
    playerCount: 0,
    playerMaxCount: 8,
  },
  {
    roomName: "room2",
    status: "waiting for players",
    playerCount: 0,
    playerMaxCount: 6,
  },
];

//create new room
function newRoom(roomName, status, playerCount) {
  const room = { roomName, status, playerCount };

  rooms.push(room);
  return room;
}

function getRoomArray() {
  return rooms;
}

/* function deleteRoom(id) {
  const index = rooms.findIndex((room) => room.id === id);

  if (index !== -1) {
    return rooms.splice(index, 1)[0];
  }
}
 */
module.exports = {
  newRoom,
  getRoomArray,
};
