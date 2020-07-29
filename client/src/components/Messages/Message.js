import React from "react";

import "../styles/style.css";

import ReactEmoji from "react-emoji";

const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  const isDataURL = (s) => {
    return !!s.match(
      /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i
    );
  };

  return isSentByCurrentUser ? (
    <>
      <div className="d-flex justify-content-end">
        <p className="text-muted m-2 pr-4">{trimmedName}</p>
      </div>
      <div className="d-flex justify-content-end">
        {isDataURL(text) ? (
          <img className="scale-down p-2 mx-3 mb-1 mess-img" src={text} />
        ) : (
          <div className="messageBox bg-sender p-2 mx-3 mb-1 text-center rounded mr-3 ">
            <p className="messageText text-white p-2 m-0">
              {ReactEmoji.emojify(text)}
            </p>
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      <div className="d-flex justify-content-start">
        <p className="text-muted m-2 pl-4">{user}</p>
      </div>
      <div className="d-flex justify-content-start">
        {isDataURL(text) ? (
          <img className="scale-down p-2 mx-3 mb-1 mess-img" src={text} />
        ) : (
          <div className="bg-receiver p-2 ml-3 mb-1 text-center rounded ">
            <p className="p-2 m-0">{ReactEmoji.emojify(text)}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Message;
