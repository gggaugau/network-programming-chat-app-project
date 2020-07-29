var md5 = require('MD5'),
    loginUser = require('./loginUser'),
    User = require('../mongo/model/user');

module.exports = function createUser(socket, username, password) {
    User.findOne({ name: username }).select('name').exec().then( async (name) => {
        if (name) {
            console.log('create.error');
            return socket.emit('create.error', false);
        }
        else {
            password = md5(password);
            var user = new User();
            user.name = username;
            user.password = password;
            await user.save();
            await loginUser(socket, username);
        }
    });
}; 
