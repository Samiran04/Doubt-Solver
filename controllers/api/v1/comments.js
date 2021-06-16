const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.createComment = async function (req, res) {
  try {
    let comment = await Comment.create({
      user: req.body.userId,
      content: req.body.content,
      post: req.body.postId,
      likes: [],
    });

    await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: comment._id },
    });

    let newComment = await Comment.findById(comment._id).populate("user");

    return res.json(200, {
      success: true,
      data: {
        comment: newComment,
      },
    });
  } catch (err) {
    console.log("Error in Create Comments", err);
    return res.json(500, {
      success: false,
      message: "Error in Create Comments",
    });
  }
};
