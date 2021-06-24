const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    messages: [
      {
        type: Object,
        obj: {
          message: String,
          email: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
