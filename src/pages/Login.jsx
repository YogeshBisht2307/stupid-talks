import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);

    const email = event.target[0].value;
    const password = event.target[1].value;

    if (!email | !password) {
      setError("Invalid Credentails");
      return;
    }

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (!response.user.emailVerified) {
        throw Error("Email is not verified.");
      }
      navigate("/");
    } catch (error) {
      if (
        (error.code === "auth/wrong-password") |
        (error.code === "auth/invalid-email")
      ) {
        setError("Invalid Credentials");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network Issue, Try again Later.");
      } else {
        setError(error.message);
      }
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Kodeweich Chat</span>
        <span className="title">Sign In</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign In</button>
          {error && <span>{error}</span>}
          {!auth.currentUser?.emailVerified && !error && (
            <span>{"Please verify your email before login."}</span>
          )}
        </form>
        <p>
          You dont have an account ? <Link to={"/register"}>Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
