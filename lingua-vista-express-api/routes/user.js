const express = require("express");
const router = express.Router();

const { queueUser } = require("../controllers/user.js");

router.post("/queue", queueUser);

module.exports = router;
