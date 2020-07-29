 
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ParticipantSchema = new Schema({
    room : { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    participant : { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

ParticipantSchema.index({ "room": 1, "participant": 1}, { "unique": true });

module.exports = mongoose.model('Participant', ParticipantSchema)