const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));

// io.use((socket, next) => {
//     const username = socket.handshake.auth.username;
//     socket.username = username;
    
//     next();
// });

let users = {};

io.on('connection', function(socket) {
    users[socket.id] = socket.id;
    io.emit('sendToLogs', `User ${users[socket.id]} have connected!`);

    socket.on('disconnect', () => {
        io.emit('sendToLogs', `User ${users[socket.id]} have disconnected!`);
        delete users[socket.id];
    });

    socket.on('changeUsername', (newUsername) => {
        io.emit('sendToLogs', `User ${users[socket.id]} changed their username to ${newUsername}!`);
        users[socket.id] = newUsername;
    });

    socket.on('sendChatMessage', (message) => {
        io.emit('sendToLogs', `(${users[socket.id]}) ${message}`);
    });

    let isPaused = false;

    socket.on('setVideo', (currentTime) => {
        isPaused = !isPaused;
        io.emit('setVideo', isPaused, currentTime);
    });

    // socket.on('isPaused', (currentTime) => {
    //     if(isPaused) {
    //         io.emit('sendToLogs',`User ${users[socket.id]} have paused the video!`);
    //         io.emit('syncTime', isPaused, currentTime);
    //     } else {
    //         io.emit('sendToLogs',`User ${users[socket.id]} is playing the video!`);
    //         io.emit('syncTime', isPaused, currentTime);
    //     }
    // })
});

//     socket.on('timeupdate', (currentTime) => {
//         console.log(`[${socket.id}] currentTime: ` + currentTime);
//         io.emit('syncTime', currentTime);
//     });


server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
