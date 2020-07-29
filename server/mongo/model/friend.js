
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var FriendSchema = new Schema({
    sender : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String
})

FriendSchema.index({ "sender": 1, "receiver": 1}, { "unique": true });

module.exports = mongoose.model('Friend', FriendSchema)