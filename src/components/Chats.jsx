import React from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = React.useState([]);
  const { currentUser } = React.useContext(AuthContext);
  const { dispatch } = React.useContext(ChatContext);

  React.useEffect(() => {
    const getChats = () => {
      const unSubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unSubscribe();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleUserSelect = React.useCallback(
    (userInfo) => {
      dispatch({ type: "CHANGE_USER", payload: userInfo });
    },
    [dispatch]
  );

  const getDateFromSeconds = (seconds) => {
    if (!seconds) return;
    const lastMsgTime = new Date(seconds * 1000);
    return `${lastMsgTime.getDate()}/${lastMsgTime.getMonth()}/${lastMsgTime.getFullYear()}`;
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((usrA, usrB) => usrB[1].date - usrA[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => handleUserSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt={chat[1].displayName} />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <div className="lastMessageInfo">
                <p>{chat[1].lastMessage?.text}</p>
                <p>{getDateFromSeconds(chat[1].lastMessage?.ts?.seconds)}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
