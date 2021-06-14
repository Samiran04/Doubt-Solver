const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email }).populate({
      path: "friends",
      populate: { path: "receiver" },
    });

    if (!user || user.password != req.body.password) {
      return res.json(422, {
        message: "Invalid User",
      });
    } else {
      return res.json(200, {
        message: "You are loged in and take care of your token now",
        data: {
          token: jwt.sign(user.toJSON(), "Codeial", { expiresIn: "1000000" }),
        },
      });
    }
  } catch (err) {
    console.log("******JWT Error", err);
    return res.json(500, {
      message: "Error in JWT",
    });
  }
};

module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.json(500, {
        message: "Password and Confirm Password dont match",
        signUp: false,
      });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.json(200, {
        message: "User already exist",
        signUp: false,
      });
    } else {
      user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      });

      return res.json(200, {
        message: "User account created",
        signUp: true,
      });
    }
  } catch (err) {
    console.log("******Error in Create/SignUp", err);
    return res.json(500, {
      message: "Error in Create/SignUp",
    });
  }
};

module.exports.update = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.json(500, {
        message: "Password not matching with confirm password",
        success: false,
      });
    }

    let user = await User.findByIdAndUpdate(req.body.id, {
      $set: { name: req.body.name, password: req.body.password },
    });

    if (!user) {
      return res.json(500, {
        message: "User doesn't exist",
        success: false,
      });
    } else {
      return res.json(200, {
        message: "Update Sucessful",
        success: true,
        data: {
          token: jwt.sign(user.toJSON(), "Codeial", { expiresIn: "1000000" }),
          user: user,
        },
      });
    }
  } catch (err) {
    console.log("Error in Update data API", err);
    return res.json(500, {
      message: "Error in Update",
      success: false,
    });
  }
};

module.exports.getUser = async function (req, res) {
  try {
    let user = await User.findById(req.query.id);

    return res.json(200, {
      user: user,
      success: true,
    });
  } catch (err) {
    console.log("Error in get user", err);
    return res.json(500, {
      message: "Error in GET USER",
      success: false,
    });
  }
};
