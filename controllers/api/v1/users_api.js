const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

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
