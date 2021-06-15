const express = require("express");
const passport = require("passport");
const router = express.Router();
const password = require("passport");

const postsApi = require("../../../controllers/api/v1/posts_api");

router.get("/", postsApi.index);
router.post("/create-post", postsApi.createPost);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postsApi.destroy
);

module.exports = router;
