import React from "react";
import { signOut, deleteUser } from "firebase/auth";
import { ref, deleteObject } from "firebase/storage";
import { auth, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "../images/ellipsis.png";

const Navbar = () => {
  const [openMenu, setMenu] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);

  const { currentUser } = React.useContext(AuthContext);

  const handleDropDownDeleteAction = () => {
    setMenu(false);
    setOpenConfirmation(true);
  };

  const handleDeleteOkAction = async () => {
    try {
      const desertRef = ref(storage, "users/" + currentUser.displayName);
      // Delete the file
      await deleteObject(desertRef);
      // delete user
      await deleteUser(currentUser);
      // close modal
      setOpenConfirmation(false);
    } catch (error) {
      console.log(error);
      if (error === "auth/requires-recent-login") {
        alert("Re-Login again to delete account.");
      }
    }
  };

  return (
    <div className="navbar">
      <span className="logo">Kodewiech Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt={currentUser.displayName} />
        <span>{currentUser.displayName}</span>
        <img
          className="menuIcon"
          src={MenuIcon}
          alt={""}
          onClick={() => setMenu(!openMenu)}
        />
        {openMenu && (
          <div className="userDropdownMenu">
            <p onClick={() => signOut(auth)}>Logout</p>
            <div className="dropdownItemDivider"></div>
            <p onClick={handleDropDownDeleteAction}>Delete Account</p>
          </div>
        )}
      </div>
      {openConfirmation && (
        <div className="deleteConfirmation">
          <div className="confirmationBody">
            Deleting account will only remove your account not your chat info
            with other users. <span>Are you sure you want to continue?</span>
          </div>
          <div className="confirmationFooter">
            <button onClick={() => setOpenConfirmation(!openConfirmation)}>
              Cancel
            </button>
            <button onClick={handleDeleteOkAction}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
