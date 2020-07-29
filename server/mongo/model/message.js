 
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MessageSchema = new Schema({
    room : { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    sender : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    created: Date
})

module.exports = mongoose.model('Message', MessageSchema)