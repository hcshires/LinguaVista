const express = require("express");
const router = express.Router();

const { queueUser } = require("../controllers/user.js");

router.post("/", (req, res) => {
  console.log("teehee");
});

router.post("/queue", queueUser);

module.exports = router;
