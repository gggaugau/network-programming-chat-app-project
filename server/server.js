const http = require("http");
const express = require("express");
const socketio = require("socket.io");
var cors = require("cors");

const {
  checkUser,
  getCurrentUser,
  getUsersInRoom,
  addCurrentUser,
  removeCurrentUser,
  setUserCurrentRoom,
  setUserFriendRequest,
  getAllCurrentUser,
  getCurrentUserByName,
  getCurrentUserById,
} = require("./controller/user");

const { createRoom } = require("./controller/room");

const { saveMessage, loadMessages } = require("./controller/message");

const User = require("./mongo/model/user");

const {
  createFriendRequest,
  updateFriendRequest,
  deleteFriendRequest,
} = require("./controller/friend");

const router = require("./router");

const mongodb = require("./mongo/config");

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

global.userSessions = {};

var getUser = require("./authentication/getUser"),
  makeUser = require("./authentication/createUser"),
  authenticateUser = require("./authentication/authenUser");

app.use(router);

io.on("connect", (socket) => {
  //get authen user
  socket.on("authen", (token) => {
    console.log(`authen`);
    getUser(token);
  });

  socket.on("register", ({ name, password }) => {
    console.log(`******* Register\nregister`);
    name = name.trim().toLowerCase();
    makeUser(socket, name, password);
  });

  socket.on("login", (data) => {
    console.log(`******* Login\nlogin`);
    authenticateUser(socket, data.name, data.password);
  });

  //log authen user out
  socket.on("logout", (token) => {
    delete userSessions[token];
  });

  socket.on("user.get", ({ name, token }, callback) => {
    console.log(`******* Load User\nuser.get`);
    if (userSessions[token] == name && token) {
      console.log(`token.authen.success: true`);
      socket.emit("token.authen.success", true);
      addCurrentUser({
        socket_id: socket.id,
        name,
      })
        .then((res) => {
          if (res.error) callback(res.error);
          else {
            const user = res.user;
            console.log(`user.load`);
            socket.emit(
              "user.load",
              user.roomList,
              user.friendList,
              user.friendRequest
            );
            console.log(`online.load`);
            io.emit("online.load", getAllCurrentUser());
          }
        })
        .catch((error) => console.log(error));
    } else {
      console.log(`token.authen.success: false`);
      socket.emit("token.authen.success", false);
    }
  });

  socket.on("room.join", ({ name, room }, callback) => {
    console.log(`******* Select Room\nroom.join`);
    socket.join(room);
    setUserCurrentRoom(name, room);
    loadMessages(room)
      .then((res) => {
        console.log(`message.load`);
        socket.emit("message.load", res);
      })
      .catch((error) => console(error));
  });

  socket.on("user.check", (name, callback) => {
    console.log(`******* Check User\nuser.check`);
    name = name.trim().toLowerCase();

    checkUser(name)
      .then((user) => {
        callback(user);
      })
      .catch((error) => {
        console.log(error);
        callback();
      });
  });

  socket.on("room.create", (req, callback) => {
    console.log(`******* Create Room\nroom.create`);
    const user = getCurrentUser(socket.id);

    req.participants.push({ _id: user.id, name: user.name });

    createRoom(req.roomName, req.participants).then((res) => {
      if (res.error) callback(res.error);
      else {
        // console.log(req.participants);
        req.participants.forEach((p) => {
          const user = getCurrentUserByName(p.name);
          if (user) {
            console.log(`room.add`);
            io.to(user.socket_id).emit("room.add", res.room);
          }
        });
      }
    });
  });

  socket.on("friend.add", (name, callback) => {
    console.log(`******* Add Friend\nfriend.add`);
    name = name.trim().toLowerCase();
    const sender = getCurrentUser(socket.id);
    const receiver = getCurrentUserByName(name);
    if (name === sender.name) {
      console.log(`callback`);
      callback(`Can not send friend request to yourself`);
    } else {
      checkUser(name)
        .then((user) => {
          if (user) {
            createFriendRequest(sender.id, user._id)
              .then((res) => {
                if (!res) {
                  console.log(`callback`);
                  callback(`You are already friend`);
                } else {
                  if (receiver) {
                    setUserFriendRequest(receiver.id).then((res) => {
                      io.to(receiver.socket_id).emit(
                        "friend.update",
                        res.friendList,
                        res.friendRequest
                      );
                    });
                  }
                }
              })
              .catch((e) => {
                console.log(`callback`);
                callback(`You are already friend`);
              });
          } else {
            callback(`User not exist`);
          }
        })
        .catch((error) => {
          console.log(error);
          callback();
        });
    }
  });

  socket.on("friend.accept", (req, callback) => {
    console.log(`******* Accept Friend\nfriend.accept`);
    updateFriendRequest(req.sender._id, req.receiver)
      .then(() => {
        setUserFriendRequest(req.receiver)
          .then((res) => {
            console.log(`friend.update`);
            socket.emit("friend.update", res.friendList, res.friendRequest);
            const sender = getCurrentUserById(req.sender._id);
            if (sender) {
              setUserFriendRequest(sender.id).then((res) => {
                console.log(`friend.update`);
                io.to(sender.socket_id).emit(
                  "friend.update",
                  res.friendList,
                  res.friendRequest
                );
              });
            }
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => console.log(error));
  });

  socket.on("friend.deny", (req, callback) => {
    console.log(`******* Deny Friend\nfriend.deny`);
    deleteFriendRequest(req.sender._id, req.receiver)
      .then(() => {
        setUserFriendRequest(req.receiver)
          .then((res) => {
            console.log(`friend.update`);
            socket.emit("friend.update", res.friendList, res.friendRequest);
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => console.log(error));
  });

  socket.on("message.send", (message, callback) => {
    console.log(`******* Send Message\nmessage.send`);
    const user = getCurrentUser(socket.id);
    console.log(`message`);
    io.to(user.room).emit("message", { user: user.name, text: message });

    saveMessage(user, message);
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeCurrentUser(socket.id);
    if (user) {
      console.log(`******* Logout\nlogout`);
      console.log(`online.load`);
      io.emit("online.load", getAllCurrentUser());
    }
  });
});

const PORT = process.env.PORT || 9999;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
