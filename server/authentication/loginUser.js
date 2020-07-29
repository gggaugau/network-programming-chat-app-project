var crypto = require('crypto'),
    getUser = require('./getUser');
const { v4: uuidv4 } = require('uuid');


module.exports = function loginUser(socket, username) {
    // var token = crypto.randomBytes(16).toString('base64').split(" ").join("");
    var token = uuidv4();
    userSessions[token] = username;
    getUser(socket, token);
}; 