import React from "react";
import "../styles/style.css";

const InfoBar = ({ room, token, handleLogout }) => {


  return (
    <div className=" py-4 shadow-sm max-height-10 d-flex justify-content-around">
      <div className="d-flex flex-row justify-content-between w-50">
        <h3 className="text-muted">#{room}</h3>
        <a
          href="/"
          className="mt-2 text-decoration-none text-muted"
          onClick={(e) => handleLogout()}
        >
          <h5>Logout</h5>
        </a>
        {/* 
        <button
          onClick={() => handleLogout()}
          className="btn mt-2"
          type="submit">
          Logout
        </button> */}
      </div>
    </div>
  );
};
export default InfoBar;
