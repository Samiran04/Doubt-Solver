const { Socket } = require('socket.io');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room', function(data){
            console.log(data);

            socket.join(data.roomName);

            io.in(data.roomName).emit('new_entry', {
                user_email: data.user_email
            });
        });

        socket.on('send_message', function(data){
            io.in(data.roomName).emit('receive_message', data);
        });
    });
}