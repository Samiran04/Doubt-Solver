const express = require("express");
const router = express.Router();

const userApi = require("../../../controllers/api/v1/users_api");

router.post("/create-session", userApi.createSession);
router.post("/create", userApi.create);
router.post("/update", userApi.update);
router.get("/get-user", userApi.getUser);

module.exports = router;
