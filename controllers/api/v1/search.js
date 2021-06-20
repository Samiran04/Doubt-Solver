const User = require("../../../models/user");

module.exports.searchUser = async function (req, res) {
  try {
    let users = await User.find({ name: { $regex: `${req.query.name}` } });

    return res.json(200, {
      success: true,
      data: {
        users: users,
      },
    });
  } catch (err) {
    console.log("Error in Search User", err);
    return res.json(500, {
      message: "Error in Search User",
      success: false,
    });
  }
};
