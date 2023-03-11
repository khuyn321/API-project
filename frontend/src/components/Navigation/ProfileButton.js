import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session'
import "./Navigation.css"
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
export default function ProfileButton({ user, setShowModal, setLogin }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <div id="floating-menu">
      <button className="menu" onClick={openMenu}>
        <i className="fa-solid fa-bars"></i>
        <i className="fa-solid fa-circle-user"></i>

      </button>
      {showMenu && (user ? (
        <ul className="profile-dropdown">
          <div id="profile-dropdown-user-info">
            <p>{user.username}</p>
            <p>{user.email}</p>
          </div>
          <li onClick={logout}>
            Log Out
          </li>
        </ul>
      ) :
        (<ul className="profile-dropdown">
          <li onClick={() => {
            setShowModal(true);
            setLogin(true);
          }}>
            {/* Log in */}
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li onClick={() => {
            setShowModal(true);
            setLogin(false);
          }}>
            {/* Sign Up */}
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </ul>))
      }
    </div>
  );
}

{/* <OpenModalButton
buttonText="Log In"
modalComponent={<LoginFormModal />}
/>
<OpenModalButton
buttonText="Sign Up"
modalComponent={<SignupFormModal />}
/> */}