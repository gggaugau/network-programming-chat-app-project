module.exports = function getUser(socket, token) {
    if (!userSessions[token]) {
        socket.emit('authen.error', {
            message: 'This user is not authenticated'
        });
        return;
    }
    
    socket.emit('authen.success', {
        profile: userSessions[token],
        token: token
    });

    console.log('authen.success');
};