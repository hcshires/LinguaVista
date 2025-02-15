const rooms = {};

const addToRoom = async (user) => {
  //implement finer matchmaking filters potentially
  const openRooms = await Object.keys(rooms).filter(
    (room) => rooms[room].users.length < 2
  );
  let roomID;

  if (openRooms.length == 0) {
    roomID = Date.now();
    rooms[roomID] = { users: [user] };
  } else {
    roomID = openRooms[0];
    rooms[roomID].users.push(user);
  }

  return roomID;
};

module.exports = { rooms, addToRoom };
