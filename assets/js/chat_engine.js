class ChatEngine{
    constructor(chatBoxId, userEmail, receiverEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.receiverEmail = receiverEmail;
        this.roomName = userEmail + receiverEmail;

        if(userEmail > receiverEmail){
            this.roomName = receiverEmail + userEmail;
        }

        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }

    connectionHandler(){

        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                roomName: self.roomName
            });

            self.socket.emit('get_data', {
                user_email: self.userEmail,
                roomName: self.roomName
            });

            self.socket.on('new_entry', function(data){

                let mess = data.message;

                if(self.userEmail == data.user_email)
                {   
                     for(var m of mess.message)
                     {
                         let newMessage = $('<li>');
                         let messageType = m.messageType;

                         newMessage.append($('<span>', {
                             html: m.msg
                         }));

                         newMessage.append($('<sub>', {
                             html: data.user_email
                         }));

                         newMessage.addClass(messageType);

                         $('#chat-messages-list').append(newMessage);
                     }
                }
            });

            $('#send-message').click(function(){
                let msg = $('#chat-message-input').val();

                if(msg != '')
                {
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        receiver_email: self.receiverEmail,
                        roomName: self.roomName
                    });
                }
            });

            self.socket.on('receive_message', function(data){
                console.log('Message received', data);


                let newMessage = $('<li>');
                let messageType = 'other-message';

                if(data.user_email == self.userEmail)
                {
                    messageType = 'self-message';
                }

                newMessage.append($('<span>', {
                    html: data.message
                }));

                newMessage.append($('<sub>', {
                    html: data.user_email
                }));

                newMessage.addClass(messageType);

                $('#chat-messages-list').append(newMessage);
            })
        });
    }
}