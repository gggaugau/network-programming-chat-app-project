var md5 = require('MD5'),
    loginUser = require('./loginUser'),
    User = require('../mongo/model/user');

module.exports = async function authenUser(socket, name, password) {
    password = md5(password);
    const user = await User.findOne({ name: name, password: password });
    if (user) {
        loginUser(socket, user.name);
    }
    else {
        socket.emit('login.error', true);
        console.log(`login.error`);
    }
};