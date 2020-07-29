const MessageModel = require("../mongo/model/message");

const saveMessage = async (user , message) => {
  await MessageModel.create({
    room : user.room,
    sender : user.id,
    content : message,
    created : Date.now(),
  });
};

const loadMessages = async (room) => {
  const msg =  await MessageModel.find({room : room}).populate('sender', '-__v -password').exec();
  return msg.map((m) => ({
    user: m.sender.name,
    text: m.content
  }));
}

module.exports = {
  saveMessage,
  loadMessages,
};
