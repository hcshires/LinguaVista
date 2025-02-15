const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/room.js");

router.post("/users", getUsers);

module.exports = router;
