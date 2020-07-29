import React from "react";

import "../styles/style.css";
import { IconContext } from "react-icons";
import { FaCircle } from "react-icons/fa";

const Online = ({name, online }) => {
  return (
    <div className=" sidebar-tab">
      <h5 className="text-muted m-4">Online</h5>
      <div className="d-flex flex-column">
        {online.map((user, i) => (
          <div
            className=" p-4"
            key={i}
          >
            <IconContext.Provider value={{ color: "green", size: "10px" }} >
              <FaCircle className="mr-3"/>
            </IconContext.Provider> {user}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Online;
