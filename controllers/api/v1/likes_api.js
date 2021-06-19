const Like = require("../../../models/likes");
const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.createLike = async function (req, res) {
  try {
    let likeable,
      deleted = false;

    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.postId).populate("Likes");
    } else {
      likeable = await Comment.findById(req.query.commentId).populate("Likes");
    }

    let existingLike = await Like.findOne({
      user: req.query.userId,
      likeable: likeable._id,
      onModel: req.query.type,
    });

    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();

      deleted = true;
    } else {
      existingLike = await Like.create({
        user: req.query.userId,
        likeable: likeable._id,
        onModel: req.query.type,
      });

      likeable.likes.push(existingLike._id);
      likeable.save();
    }

    return res.json(200, {
      success: true,
      deleted: deleted,
      like: existingLike,
    });
  } catch (err) {
    console.log("Error in Create Like", err);
    return res.json(500, {
      message: "Error in Create Like",
      success: false,
    });
  }
};
