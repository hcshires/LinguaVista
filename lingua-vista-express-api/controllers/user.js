const { addToRoom } = require("../models/userRooms.js");

const queueUser = async (req, res) => {
  const roomID = await addToRoom(req.body);

  res.status(200).send({ roomID: roomID });
};

module.exports = { queueUser };
