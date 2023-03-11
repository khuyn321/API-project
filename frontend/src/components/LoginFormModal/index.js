// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal({ setShowModal }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  // const { closeModal } = useModal();

  function demoLogin(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(sessionActions.login({ credential: "DaBestDemoUser", password: "password" }))
    setShowModal(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      // .then(closeModal)
      .then(() => setShowModal(false))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div className='login-form-container'>
      <div className="signuplogin-form-header">
        <div className="signuplogin-form-x" onClick={() => setShowModal(false)}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="signuplogin-form-title">
          <h1>Log in</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <ul className="errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <input
          className="form-first-input"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder='Username or email'
          required
        />
        <input
          className="form-last-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        <button type="submit" className="submit">Log In</button>
        <button className="submit" id="demo-user" onClick={demoLogin}>Log In as Demo User</button>
      </form>
    </div >

    //   <>
    //     <h1>Log In</h1>
    //     <form onSubmit={handleSubmit}>
    //       <div className="login-form-container">
    //         <ul>
    //           {errors.map((error, idx) => (
    //             <li key={idx}>{error}</li>
    //           ))}
    //         </ul>
    //         <label>
    //           Username or Email
    //           <div className='login-form-credential-container'>
    //             <input
    //               type="text"
    //               value={credential}
    //               onChange={(e) => setCredential(e.target.value)}
    //               required
    //             />
    //           </div>
    //         </label>
    //         <label>
    //           Password
    //           <div className="login-form-password-container">
    //             <input
    //               type="password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               required
    //             />
    //           </div>
    //         </label>
    //         <button type="submit">Log In</button>
    //       </div>
    //     </form>
    //   </>
  );
}

export default LoginFormModal;