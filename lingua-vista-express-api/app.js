const express = require("express");
const cors = require("cors");

const { peerServer, startPeer } = require("./routes/stream.js");
const userRooms = require("./models/userRooms.js");
const user = require("./routes/user.js");
const room = require("./routes/room.js");

const app = express();

const Port = 3010;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use("/api/stream", peerServer);
app.use("/api/user", user);
app.use("/api/room", room);
startPeer();

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
