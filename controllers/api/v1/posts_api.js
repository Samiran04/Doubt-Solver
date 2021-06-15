const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
const User = require("../../../models/user");

module.exports.createPost = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.body.userId,
      likes: [],
      comments: [],
    });

    let newPost = await Post.findById(post._id)
      .populate("user")
      .populate("comments");

    return res.json(200, {
      success: true,
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    console.log("Error in Create Post", err);
    return res.json(500, {
      success: false,
      message: "Error in Create Post",
    });
  }
};

module.exports.index = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    return res.json(200, {
      message: "Users Details",
      posts: posts,
    });
  } catch (err) {
    console.log("Error", err);
    return res.json(500, {
      message: "Serever Error",
    });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (post && post.user == req.user.id) {
      post.remove();

      Comment.deleteMany({ posts: req.params.id });

      return res.json(200, {
        message: "Posts Deleted",
      });
    } else {
      return res.json(401, {
        message: "User not autherised or post not found",
      });
    }
  } catch (err) {
    console.log("--Error while deleting post--", err);
    return res.json(500, {
      message: "Server Error",
    });
  }
};
