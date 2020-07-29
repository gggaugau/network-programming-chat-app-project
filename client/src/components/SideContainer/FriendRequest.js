import React from "react";
import { Button } from "react-bootstrap";
import "../styles/style.css";
import { IconContext } from "react-icons";
import { MdCheck, MdClear } from "react-icons/md";

const FriendRequest = ({ friendRequest, acceptFriend, denyFriend }) => {
  return (
    <div className=" request-tab">
      <h5 className="text-muted m-4">Friend Requests</h5>
      <div className="d-flex flex-column">
        {friendRequest.map((req, i) => (
          <div className=" pt-4 px-4" key={i}>
            {req.sender.name}&emsp;
            <IconContext.Provider value={{ color: "green", size: "30px" }}>
              <MdCheck onClick={(e) => acceptFriend(req)} className="icon" />
            </IconContext.Provider>
            &emsp;
            <IconContext.Provider value={{ color: "red", size: "30px" }}>
              <MdClear onClick={(e) => denyFriend(req)} className="icon" />
            </IconContext.Provider>
   
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;
