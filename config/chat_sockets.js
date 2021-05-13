const { Socket } = require('socket.io');
const Chat = require('../models/chat');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room', function(data){

            Chat.findOne({roomName: data.roomName, email: data.user_email}, function(err, room){
                if(err)
                {
                    console.log(err);
                    return;
                }
                if(room){
                    socket.join(data.roomName);
                }else{
                    Chat.create({
                        roomName: data.roomName,
                        email: data.user_email
                    }, function(err, newRoom){

                        if(err){console.log(err); return;}

                        socket.join(data.roomName);
                    });
                }
            });
        });

        socket.on('get_data', function(data){
            Chat.findOne({roomName: data.roomName, email: data.user_email}, function(err, room){
                if(err){console.log(err); return;}

                //console.log('HERE', room);

                io.in(data.roomName).emit('new_entry', {
                    user_email: data.user_email,
                    message: room
                });
            });
        });

        socket.on('send_message', function(data){

            Chat.findOne({roomName: data.roomName, email: data.receiver_email}, function(err, room){
                if(err){console.log(err); return}

                if(room)
                {
                    room.message.push({msg: data.message, messageType: 'other-message'});
                    room.save();

                    Chat.findOne({roomName: data.roomName, email: data.user_email}, function(err, myRoom){
                        if(err){console.log(err); return}

                        let obj = {msg: data.message, messageType: 'self-message'}

                        myRoom.message.push(obj);
                        myRoom.save();

                        io.in(data.roomName).emit('receive_message', data);
                    });
                }else{
                    Chat.create({
                        roomName: data.roomName, 
                        email: data.receiver_email
                    }, function(err, newRoom){
                        if(err){
                            console.log(err); return;
                        }
                        newRoom.message.push({msg: data.message, messageType: 'other-message'});
                        newRoom.save();

                        Chat.findOne({roomName: data.roomName, email: data.user_email}, function(err, myRoom){
                            if(err){console.log(err); return}

                            myRoom.message.push({msg: data.message, messageType: 'self-message'});
                            myRoom.save();

                            io.in(data.roomName).emit('receive_message', data);
                        });
                    });
                }
            })
        });
    });
}