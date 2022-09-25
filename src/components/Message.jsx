import React from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = React.useContext(AuthContext);
  const { data } = React.useContext(ChatContext);

  const ref = React.useRef();
  const messageTime = new Date(message.date.seconds * 1000);

  React.useEffect(() => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt={""}
        />
        <span>{messageTime.getHours() + ":" + messageTime.getMinutes()}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt={""} />}
      </div>
    </div>
  );
};

export default Message;
