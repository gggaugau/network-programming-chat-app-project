 
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RoomSchema = new Schema({
    name: String,
    created: Date
})

module.exports = mongoose.model('Room', RoomSchema)