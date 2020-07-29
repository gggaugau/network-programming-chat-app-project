const UserModel = require("../mongo/model/user");
const ParticipantModel = require("../mongo/model/participant");
const FriendModel = require("../mongo/model/friend");
const currentUsers = [];

const checkUser = async (name) => {
  return await UserModel.findOne({ name: name }).select("name").exec();
};

// const getUserRoomList = async (id) => {
//   console.log(
//     await ParticipantModel.find({ participant: id }).populate("room").exec()
//   );

// };

const getAllCurrentUser = () => {
  return currentUsers.map((r) => r.name);
};

const getCurrentUserByName = (name) =>
  currentUsers.find((user) => user.name === name);

const getCurrentUserById = (id) =>
  currentUsers.find((user) => user.id === id);

const addCurrentUser = async ({ socket_id, name }) => {
  const res = await UserModel.findOne({ name: name }).select("name").exec();

  if (res) {
    r = await ParticipantModel.find({ participant: res._id })
      .populate("room", "-__v")
      .exec();
    friendRequest = await FriendModel.find({
      receiver: res._id,
      status: "pending",
    })
      .populate("sender", "-__v")
      .exec();

    friendList = await FriendModel.find({
      $or: [{ sender: res._id }, { receiver: res._id }],
      status: "friend",
    })
      .populate("sender receiver", "-__v")
      .exec();

    const roomList = r.map((r) => r.room).reverse();

    const user = {
      socket_id,
      id: res.id,
      name: res.name,
      room: "welcome",
      roomList,
      friendRequest,
      friendList,
    };
    currentUsers.push(user);
    return await { user };
  }
  return await { error: "Dont try to hack" };
};

const removeCurrentUser = (id) => {
  const index = currentUsers.findIndex((user) => user.socket_id === id);

  if (index !== -1) return currentUsers.splice(index, 1)[0];
};

const getCurrentUser = (id) =>
  currentUsers.find((user) => user.socket_id === id);

// const getUsersInRoom = (room) =>
//   currentUsers.filter((user) => user.room === room);

const setUserCurrentRoom = (name, room) => {
  currentUsers.find((user) => user.name === name).room = room;
};

const setUserFriendRequest = async (id) => {
  const friendRequest = await FriendModel.find({
    receiver: id,
    status: "pending",
  })
    .populate("sender", "-__v")
    .exec();

  const friendList = await FriendModel.find({
    $or: [{ sender: id }, { receiver: id }],
    status: "friend",
  })
    .populate("sender receiver", "-__v")
    .exec();

  currentUsers.find((user) => user.id === id).friendRequest = friendRequest;
  currentUsers.find((user) => user.id === id).friendList = friendList;

  return await { friendRequest, friendList };
};

module.exports = {
  checkUser,
  getCurrentUser,
  // getUsersInRoom,
  addCurrentUser,
  removeCurrentUser,
  setUserCurrentRoom,
  setUserFriendRequest,
  getAllCurrentUser,
  getCurrentUserByName,
  getCurrentUserById,
};
