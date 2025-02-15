const { rooms } = require("../models/userRooms.js");

const getUsers = async (req, res) => {
  console.log(req.body);
  const roomID = await Object.keys(rooms).find(
    (room) => room == req.body.roomID
  );
  console.log(rooms[roomID]);

  res.status(200).send(rooms[roomID] ?? rooms[roomID].users);
};

module.exports = { getUsers };
