const Chat = require("../../../models/chat.js");

module.exports.getMessages = async function (req, res) {
  try {
    let chat = await Chat.findOne({ roomeName: req.query.roomeName });

    if (!chat) {
      chat = await Chat.create({
        roomeName: req.query.roomeName,
        messages: [],
      });
    }

    return res.json(200, {
      success: true,
      data: {
        chat: chat,
      },
    });
  } catch (err) {
    console.log("Error in Chat Controller", err);
    return res.json(500, {
      message: "Error in Chat Controller",
      success: false,
    });
  }
};
