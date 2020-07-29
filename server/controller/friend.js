const FriendModel = require("../mongo/model/friend");

const createFriendRequest = async (sender, receiver) => {
  const res = await FriendModel.findOne({sender: receiver, receiver: sender}).exec();
  if (res) return;
  const req = new FriendModel();
  req.sender = sender;
  req.receiver = receiver;
  req.status = "pending";
  return await req.save();
};

const updateFriendRequest = async (sender, receiver) => {
  return await FriendModel.findOneAndUpdate(
    { sender: sender, receiver: receiver },
    { status: "friend" },
    { new: true }
  );
};

const deleteFriendRequest = async (sender, receiver) => {
  return await FriendModel.findOneAndDelete({
    sender: sender,
    receiver: receiver,
  });
};

module.exports = {
  createFriendRequest,
  updateFriendRequest,
  deleteFriendRequest,
};
