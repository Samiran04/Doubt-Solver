const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/friends", require("./friends"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));
router.use("/search", require("./search"));

module.exports = router;
