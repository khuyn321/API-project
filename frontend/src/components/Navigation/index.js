import React from 'react';
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import logo from './logo-w-text.png'
import { Modal } from '../../context/Modal';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.session.user)
  const [showModal, setShowModal] = useState(false)
  const [login, setLogin] = useState(true)


  return (
    <div className="nav-bar">
      <div>
        <span className="logo-div">
          <NavLink exact to="/">
            <img src={logo} alt="Logo" className="logo" />
          </NavLink>
        </span>
      </div>
      <div className='top-right'>
        {user && <Link id="become-a-host-button" to="/spot/create">Create a New Spot</Link>}
        <li id="profile-button">
          {isLoaded && (
            <ProfileButton
              user={sessionUser}
              setLogin={setLogin}
              setShowModal={setShowModal} />
          )}
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              {login ? (
                <LoginFormModal setShowModal={setShowModal} />
              ) : (
                <SignupFormModal setShowModal={setShowModal} />
              )}
              {/* <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              /> */}

            </Modal>
          )}
        </li>
      </div>
    </div >
  );
}

//   return (
//     <div className="nav-bar">
//       <span className="logo-div">
//         <NavLink exact to="/">
//           <img src={logo} alt="Logo" className="logo" />
//         </NavLink>
//       </span>
//       {isLoaded && sessionLinks}
//     </div>
//   );
// }

export default Navigation;

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );

// } else {
//   sessionLinks = (
//     <span className="header-buttons-container">
      // <OpenModalButton
      //   buttonText="Log In"
      //   modalComponent={<LoginFormModal />}
      // />
      // <OpenModalButton
      //   buttonText="Sign Up"
      //   modalComponent={<SignupFormModal />}
      // />
//     </span>
//   );
// }