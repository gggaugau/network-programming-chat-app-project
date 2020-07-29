import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import Room from "../SideContainer/Room";
import FriendRequest from "../SideContainer/FriendRequest";
import Friend from "../SideContainer/Friend";
import Online from "../SideContainer/Online";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Messages/Input";

import { Redirect, useHistory } from "react-router-dom";

import "../styles/style.css";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [userToCheck, setUserToCheck] = useState("");
  const [participants, setParticipants] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [online, setOnline] = useState([]);
  const [image, setImage] = useState({ file: "", imagePreviewUrl: "" });

  const history = useHistory();

  const ENDPOINT = "192.168.43.63:9999";

  useEffect(() => {
    const loc = queryString.parse(location.search);

    socket = io(ENDPOINT);
    setName(loc.name);
    setToken(loc.token);

    // socket.emit("user.get", { name: loc.name }, (error) => alert(error));

    socket.emit("user.get", { name: loc.name, token: loc.token }, (error) =>
      alert(error)
    );

    if (!loc.room) setRoom("welcome");
    else setRoom(loc.room);
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("online.load", (online) => {
      setOnline(online);
    });

    socket.on("message.load", (messages) => {
      setMessages(messages);
    });

    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("room.user.get", ({ users }) => {
      setUsers(users);
    });

    socket.on("user.load", (rooms, fl, frq) => {
      setFriendList(fl);
      setFriendRequest(frq);
      setRoomList(rooms);
    });

    socket.on("room.add", (room) => {
      setRoomList((roomList) => [room, ...roomList]);
    });

    socket.on("friend.update", (fl, frq) => {
      setFriendList(fl);
      setFriendRequest(frq);
    });

    socket.on("token.authen.success", (check) => {
      if (!check) {
        history.push("/");
      }
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("message.send", message, () => setMessage(""));
    }
    if (image.imagePreviewUrl) {
      socket.emit("message.send", image.imagePreviewUrl, () =>
        setImage({ file: "", imagePreviewUrl: "" })
      );
    }
  };

  const sendUserToCheck = (event) => {
    event.preventDefault();
    if (userToCheck) {
      if (userToCheck === name) return;
      if (!participants.find((user) => user.name === userToCheck)) {
        socket.emit("user.check", userToCheck, (user) => {
          if (user) {
            setParticipants((users) => [...users, user]);
            setUserToCheck("");
          }
        });
      }
    }
  };

  const sendCreateRoom = (event) => {
    if (participants.length !== 0) {
      socket.emit("room.create", { roomName, participants }, (error) => {
        alert(error);
      });
    }
  };

  const sendFriendRequest = (event) => {
    socket.emit("friend.add", userToCheck, (error) => {
      alert(error);
    });
  };

  const changeRoom = (room) => {
    window.history.pushState(
      `/chat?name=${name}`,
      "",
      `/chat?name=${name}&room=${room._id}&token=${token}`
    );
    setMessages([]);
    socket.emit(
      "room.join",
      { name: name, room: room._id, roomName: room.name },
      (error) => alert(error)
    );
    setRoom(room.name);
  };

  const handleLogout = () => {
    socket.emit("logout", token, (error) => alert(error));
  };

  const acceptFriend = (req) => {
    socket.emit("friend.accept", req, (error) => {
      alert(error);
    });
  };

  const denyFriend = (req) => {
    socket.emit("friend.deny", req, (error) => {
      alert(error);
    });
  };

  const handleUploadClick = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };
  };

  return (
    <div className="d-flex flex-column justify-content-start h-100">
      <InfoBar room={room} handleLogout={handleLogout} />
      <div className="d-flex flex-row h-100 w-100">
        <div className="side-container d-flex flex-column justify-content-start">
          <Room
            roomName={roomName}
            setRoomName={setRoomName}
            userToCheck={userToCheck}
            setUserToCheck={setUserToCheck}
            sendUserToCheck={sendUserToCheck}
            participants={participants}
            setParticipants={setParticipants}
            sendCreateRoom={sendCreateRoom}
            roomList={roomList}
            changeRoom={changeRoom}
          />
          <FriendRequest
            friendRequest={friendRequest}
            acceptFriend={acceptFriend}
            denyFriend={denyFriend}
          />
        </div>
        <div className="d-lg-flex flex-column justify-content-start flex-fill">
          
          {room === "welcome" ? (<div className="mt-5 text-muted align-self-center"><h5>Welcome to messengau!</h5>
          <h5>Create or select a room to start chatting.</h5></div>) : (<>
            <Messages messages={messages} name={name} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              image={image}
              setImage={setImage}
              handleUploadClick={handleUploadClick}
            /></>
          )}
        </div>
        <div className="side-container d-flex flex-column justify-content-start">
          <Online name={name} online={online} />
          <Friend
            name={name}
            userToCheck={userToCheck}
            setUserToCheck={setUserToCheck}
            sendFriendRequest={sendFriendRequest}
            friendList={friendList}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
