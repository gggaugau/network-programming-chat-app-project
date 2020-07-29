import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../styles/style.css";
import { IconContext } from "react-icons";
import { MdGroupAdd, MdGroup } from "react-icons/md";

const Room = ({
  roomName,
  setRoomName,
  userToCheck,
  setUserToCheck,
  sendUserToCheck,
  participants,
  setParticipants,
  sendCreateRoom,
  roomList,
  changeRoom,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setRoomName("");
    setUserToCheck("");
    setParticipants([]);
  };
  const handleShow = () => setShow(true);

  return (
    <div className="room-tab">
      <div>
        <h5 className="text-muted m-0 p-4">
          Room&emsp;
          <IconContext.Provider value={{ color: "gray", size: "30px" }}>
            <MdGroupAdd onClick={handleShow} className="icon" />
          </IconContext.Provider>
          {/* <Button variant=""  className="rounded-circle">
            +
          </Button> */}
        </h5>
      </div>
      <div className="d-flex flex-column">
        {roomList.map((room, i) => (
          <div className=" p-4 room" key={i} onClick={(e) => changeRoom(room)}>
            <IconContext.Provider value={{ color: "gray", size: "20px" }}>
              <MdGroup  className="mr-3"/>
            </IconContext.Provider>{" "}
            {room.name}
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose}>
        <div className="p-4 d-flex flex-column justify-content-center align-items-center">
          <h5 className="text-muted">Create Room</h5>

          <div className="d-flex flex-column align-items-center">
            <input
              placeholder="Room Name"
              className="mt-4 px-4 py-2 shadow-sm border-0 w-100"
              type="text"
              value={roomName}
              onChange={({ target: { value } }) => setRoomName(value)}
            />
            <div>
              <input
                placeholder="User"
                className="my-4 px-4 py-2 shadow-sm border-0"
                type="text"
                value={userToCheck}
                onChange={({ target: { value } }) => setUserToCheck(value)}
              />
              <Button onClick={(e) => sendUserToCheck(e)}>Add</Button>
            </div>
          </div>

          <div className="d-flex flex-column justify-content-start w-50">
            {participants.map((user, i) => (
              <div className="mb-3" key={i}>
                + {user.name}
              </div>
            ))}
          </div>
          <div>
            <Button
              variant=""
              className="mr-2"
              onClick={(e) => {
                sendCreateRoom(e);
                handleClose();
              }}
            >
              Create
            </Button>
            <Button
              variant=""
              className="btn-outline-secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Room;
