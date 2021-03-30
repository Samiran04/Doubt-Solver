class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

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
                roomName: 'Codeial'
            });

            self.socket.on('new_entry', function(data){
                console.log(data);
            });

            $('#send-message').click(function(){
                let msg = $('#chat-message-input').val();

                if(msg != '')
                {
                    self.socket.emit('send_message', {
                        message: msg,
                        user_email: self.userEmail,
                        roomName: 'Codeial'
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