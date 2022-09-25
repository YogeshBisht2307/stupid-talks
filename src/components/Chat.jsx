import React from "react";
import CameraPng from "../images/camera.png";
import AddFriendPng from "../images/add-user.png";
import HorizontalDotsPng from "../images/ellipsis.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = React.useContext(ChatContext);

  return (
    <div className="chat">
      {data.chatId !== "null" ? (
        <>
          <div className="chatInfo">
            <span>{data.user?.displayName}</span>
            <div className="chatIcon">
              <img src={CameraPng} alt="" />
              <img src={AddFriendPng} alt="" />
              <img src={HorizontalDotsPng} alt="" />
            </div>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <div className="selectChatInfo">Select a User to Start Chat!</div>
      )}
    </div>
  );
};

export default Chat;
