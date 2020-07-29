const RoomModel = require("../mongo/model/room");
const ParticipantModel = require("../mongo/model/participant");

const createRoom = async (roomName, participants) => {
  if (roomName.trim().length === 0) return await { error: "Room can not be blank" };
  if (participants.length === 0) return await  { error: "dua bo may a?" };

  const room = new RoomModel();
  room.name = roomName;
  room.created = Date.now();
  
  const res = await room.save();

  let p = participants.map((p) => ({
    participant: p._id,
    room: res._id,
  }));

  await ParticipantModel.create(p);

  return {room : res};
};

// const getRoom = async (id) => {
//   RoomModel.findOne
// }

module.exports = {
  createRoom,
};
