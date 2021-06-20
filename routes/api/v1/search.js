const express = require("express");
const router = express.Router();

const search_controller_api = require("../../../controllers/api/v1/search");

router.get("/search-users", search_controller_api.searchUser);

module.exports = router;
