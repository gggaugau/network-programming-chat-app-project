import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../styles/style.css";
import { IconContext } from "react-icons";
import { MdPersonAdd, MdPerson } from "react-icons/md";

const Friend = ({
  name,
  userToCheck,
  setUserToCheck,
  sendFriendRequest,
  friendList,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setUserToCheck("");
  };
  const handleShow = () => setShow(true);

  return (
    <div className="sidebar-tab">
      <div>
        <h5 className="text-muted m-0 p-4">
          Friends&emsp;
          <IconContext.Provider value={{ color: "gray", size: "30px" }}>
            <MdPersonAdd onClick={handleShow} className="icon" />
          </IconContext.Provider>
        </h5>
      </div>

      <div className="d-flex flex-column">
        {friendList.map((friend, i) => (
          <div
            className=" p-4"
            key={i}
            // onClick={(e) => changeFriend(Friend)}
          >
            <IconContext.Provider value={{ color: "gray", size: "20px" }} >
              <MdPerson className="mr-3"/>
            </IconContext.Provider>{" "}
            {friend.sender.name === name
              ? friend.receiver.name
              : friend.sender.name}
          </div>
        ))}
      </div>

      <Modal show={show} onHide={handleClose}>
        <div className="p-4 d-flex flex-column justify-content-center align-items-center">
          <h5 className="text-muted">Add Friend</h5>

          <div className="d-flex flex-column align-items-center">
            <input
              placeholder="User"
              className="my-4 px-4 py-2 shadow-sm border-0"
              type="text"
              value={userToCheck}
              onChange={({ target: { value } }) => setUserToCheck(value)}
            />
          </div>

          <div>
            <Button
              variant=""
              className="mr-2"
              onClick={(e) => {
                sendFriendRequest(e);
                handleClose();
              }}
            >
              Send Request
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

export default Friend;
