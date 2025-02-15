const express = require("express");
const cors = require("cors");
const userRooms = require("./models/userRooms.js");
const user = require("./routes/user.js");
const image = require("./routes/image.js");

const app = express();
const port = 3010;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.json());
app.use(cors());
app.use("/api/user", user);
app.use("/api/image", image);
