import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session'
import "./Navigation.css"
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { Link, useHistory } from "react-router-dom";


export default function ProfileButton({ user, setShowModal, setLogin }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);


  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
    return history.push('/')

  };

  return (
    <div id="floating-menu">
      <button className="menu" onClick={openMenu}>
        {/* <i className="fa-solid fa-bars"></i>
        <i className="fa-solid fa-circle-user"></i> */}
        ☰👤

      </button>
      {showMenu && (user ? (
        <ul className="profile-dropdown" ref={ulRef}>
          <div id="profile-dropdown-user-info">
            <p>Hello, {user.username}</p>
            <p>{user.email}</p>
          </div>
          <li>
            <Link to={'/spots/current'}> Manage Spots</Link>
          </li>
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
              className='menu-buttons'
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <hr />
          <li onClick={() => {
            setShowModal(true);
            setLogin(false);
          }}>
            {/* Sign Up */}
            <OpenModalButton
              className='menu-buttons'
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