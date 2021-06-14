const Friend = require("../../../models/friendship");
const User = require("../../../models/user");

module.exports.addFriend = async function (req, res) {
  try {
    let user1 = await User.findOne({ email: req.query.email1 });
    let user2 = await User.findOne({ email: req.query.email2 });

    let friend1 = await Friend.create({
      requester: user1._id,
      receiver: user2._id,
      status: 3,
      friends: true,
    });

    let friend2 = await Friend.create({
      requester: user2._id,
      receiver: user1._id,
      status: 3,
      friends: true,
    });

    await User.findByIdAndUpdate(user1._id, {
      $push: { friends: friend1._id },
    });

    await User.findByIdAndUpdate(user2._id, {
      $push: { friends: friend2._id },
    });

    friend1 = await Friend.findById(friend1._id).populate("receiver");

    return res.json(200, {
      success: true,
      data: {
        friend: friend1,
      },
    });
  } catch (err) {
    console.log("Error in Add Friend", err);
    return res.json(500, {
      success: false,
      error: "Error in Add Friend",
    });
  }
};

module.exports.removeFriend = async function (req, res) {
  try {
    let user1 = await User.findOne({ email: req.query.email1 });
    let user2 = await User.findOne({ email: req.query.email2 });

    let friend1 = await Friend.findOneAndRemove({
      requester: user1._id,
      receiver: user2._id,
    });

    let friend2 = await Friend.findOneAndRemove({
      requester: user2._id,
      receiver: user1._id,
    });

    await User.findByIdAndUpdate(user1._id, {
      $pull: { friends: friend1._id },
    });

    await User.findByIdAndUpdate(user2._id, {
      $pull: { friends: friend2._id },
    });

    return res.json(200, {
      success: true,
      data: {
        friend: friend1,
      },
    });
  } catch (err) {
    console.log("Error in Remove Friend", err);
    return res.json(500, {
      success: false,
      error: "Error in Remove Friend",
    });
  }
};

module.exports.getFriend = async function (req, res) {
  try {
    let user = await User.findById(req.query.userId).populate({
      path: "friends",
      populate: { path: "receiver" },
    });

    return res.json(200, {
      success: true,
      data: {
        friends: user.friends,
      },
    });
  } catch (err) {
    console.log("Error in Get Friend", err);

    return res.json(500, {
      success: false,
      message: "Error in Get Friend",
    });
  }
};
