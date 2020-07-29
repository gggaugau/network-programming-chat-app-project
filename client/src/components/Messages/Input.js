import React, { useState, useEffect } from "react";
import { RiImageAddLine } from "react-icons/ri";

import { IconContext } from "react-icons";
import "../styles/style.css";

const Input = ({ setMessage, sendMessage, message, image, setImage, handleUploadClick }) => {
  
  let { imagePreviewUrl } = image;

  return (
    <div>
      <form className="d-flex max-height-10 ">
        <input
          accept="image/*"
          className="d-none"
          id="contained-button-file"
          type="file"
          onChange={handleUploadClick}
        />
        <label htmlFor="contained-button-file">
          <IconContext.Provider value={{ color: "gray", size: "30px" }}>
            <RiImageAddLine className="mx-4 mt-4 icon" />
          </IconContext.Provider>
        </label>
        <img className="d-flex scale-down" src={imagePreviewUrl} />
        <input
          className="p-4 pt-2 w-75 border type-mess"
          type="text"
          placeholder="Type something"
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />

        <button className="btn w-25" onClick={(e) => sendMessage(e)}>
          Send
        </button>
      </form>
      
    </div>
  );
};

export default Input;
