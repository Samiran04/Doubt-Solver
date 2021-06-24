const { Socket } = require("socket.io");
const Chat = require("../models/chat");
const User = require("../models/user");

module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);

  io.sockets.on("connection", function (socket) {
    console.log("new connection received", socket.id);

    socket.on("disconnect", function () {
      console.log("socket disconnected!");
    });

    socket.on("join_room", function (data) {
      Chat.findOne(
        { roomName: data.roomName, email: data.receiver_email },
        function (err, room) {
          if (err) {
            console.log(err);
            return;
          }
          if (room) {
            socket.join(data.roomName);
            socket.emit("user_joined", {
              email: data.user_email,
            });
          } else {
            Chat.create(
              {
                roomName: data.roomName,
                email: data.user_email,
              },
              function (err, newRoom) {
                if (err) {
                  console.log(err);
                  return;
                }

                socket.join(data.roomName);
                socket.emit("user_joined", {
                  email: data.user_email,
                });
              }
            );
          }
        }
      );
    });

    socket.on("get_data", function (data) {
      Chat.findOne(
        { roomName: data.roomName, email: data.user_email },
        function (err, room) {
          if (err) {
            console.log(err);
            return;
          }

          //console.log('HERE', room);

          io.in(data.roomName).emit("new_entry", {
            user_email: data.user_email,
            message: room,
          });
        }
      );
    });

    socket.on("send_message", function (data) {
      Chat.findOne({ roomName: data.roomName }, function (err, room) {
        if (err) {
          console.log("Error in Chat Send Message", err);
          return;
        }

        if (!room) {
          Chat.create(
            { roomName: data.roomName, messages: [] },
            function (err, room) {
              if (err) {
                console.log("Error in Chat Send Message", err);
                return;
              }

              room.messages.push({
                email: data.user_email,
                message: data.message,
              });
              room.save();

              io.in(data.roomName).emit("receive_message", data);
            }
          );
        } else {
          room.messages.push({ email: data.user_email, message: data.message });
          room.save();

          io.in(data.roomName).emit("receive_message", data);
        }
      });
    });
  });
};
