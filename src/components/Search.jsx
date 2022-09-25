import React from "react";
import {
  collection,
  getDocs,
  getDoc,
  query,
  setDoc,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [error, setError] = React.useState(false);

  const { currentUser } = React.useContext(AuthContext);

  const handleSearch = async () => {
    const searchQuery = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(searchQuery);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  };

  const handleKeyDown = (event) => {
    event.code === "Enter" && handleSearch();
  };

  const handleUserSelect = async () => {
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const response = await getDoc(doc(db, "chats", combinedID));
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinedID), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
      setError(true);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a User"
          value={username}
          onKeyDown={handleKeyDown}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>
      {error && <span>User not found !</span>}
      {user && (
        <div className="userChat" onClick={handleUserSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
