import React from "react";
import addImage from "../images/upload.png";
import { auth, storage, db } from "../firebase";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const img = event.target[3].files[0];

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email.toLowerCase(),
        password
      );

      const storageRef = ref(storage, "users/" + displayName);

      await uploadBytes(storageRef, img);
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(response.user, {
        displayName,
        photoURL,
      });

      await setDoc(doc(db, "users", response.user.uid), {
        uid: response.user.uid,
        displayName,
        email: email.toLowerCase(),
        photoURL,
      });

      await setDoc(doc(db, "userChats", response.user.uid), {});

      await sendEmailVerification(response.user);
      navigate("/login");
    } catch (error) {
      if (error.code === "deadline-exceeded") {
        setError("Unable to perform operatiron, try again later.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Kodeweich Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input hidden type="file" id="avtarFile" />
          <label htmlFor="avtarFile">
            <img src={addImage} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>
          {error && <span>{error}</span>}
        </form>
        <p>
          You do have an account ? <Link to={"/login"}>Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
