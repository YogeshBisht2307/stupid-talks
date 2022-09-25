import React from "react";
import Picker from "emoji-picker-react";
import ImageUpload from "../images/upload-file.png";
import EmojiIcon from "../images/emoji.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Input = () => {
  const [text, setText] = React.useState("");
  const [img, setImg] = React.useState(null);

  const { currentUser } = React.useContext(AuthContext);
  const { data } = React.useContext(ChatContext);

  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setText(text + emojiObject.emoji);
  };

  const handleKeyDown = (event) => {
    event.code === "Enter" && handleMessageSent();
  };

  const handleMessageSent = async () => {
    if (img) {
      const storageRef = ref(storage, "chatImage/" + uuid());
      await uploadBytes(storageRef, img);
      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: photoURL,
        }),
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        ts: Timestamp.now(),
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
        ts: Timestamp.now(),
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something..."
        value={text}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowEmojiPicker(false)}
        onChange={(event) => setText(event.target.value)}
      />
      {showEmojiPicker && (
        <div className="emojiPicker">
          <Picker
            disableSearchBar={true}
            onEmojiClick={onEmojiClick}
            groupVisibility={{
              flags: false,
              symbols: false,
              travel_places: false,
            }}
          />
        </div>
      )}
      <div className="send">
        <img
          src={EmojiIcon}
          alt=""
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(event) => setImg(event.target.files[0])}
        />
        <label htmlFor="file">
          <img src={ImageUpload} alt="" />
        </label>
        <button onClick={handleMessageSent}>Send</button>
      </div>
    </div>
  );
};

export default Input;
