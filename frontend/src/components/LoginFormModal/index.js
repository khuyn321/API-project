// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
// import { useHistory } from 'react-router-dom';
import "./LoginForm.css";

// function formValidator(name, description, price, address, city, state, country, image) {
//   const errors = []

//   if (!name) errors.push("Please provide your spot's name")
//   else if (name.length > 255) errors.push("Name cannot be longer than 255 characters")
//   if (description.length === 0) errors.push("Description cannot be empty")
//   else if (description.length > 255) errors.push("Description cannot be over 255 characters");
//   if (price < 0 || price > 100000) errors.push("Price cannot exceed $100,000")
//   return errors;
// }

// function formValidator(credential, password) {
//   const errors = []

//   if ()
// }

function LoginFormModal({ setShowModal }) {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  // const history = useHistory();
  // const [showModal, setShowModal] = useState(false)
  // const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => setShowModal(false))
      // .then(() => history.push('/'))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  function demoLogin(e) {
    e.preventDefault();
    setErrors([])
    // e.stopPropagation();
    return dispatch(sessionActions.login({ credential: "DaBestDemoUser", password: "password" }))
      .then(() => setShowModal(false))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };


  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = formValidator(credential, password)
  //   // setErrors([])
  //   if (errors.length > 0) {
  //     return setErrors(errors)
  //   }
  //   try {
  //     dispatch(sessionActions.login({ credential, password }))
  //     setShowModal(false)
  //   } catch (errors) {
  //     const data = await errors.json();
  //     setErrors(data.errors);
  //     return;
  //   }
  //   return history.push("/")
  // }

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
            <li key={idx}>
              {error}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder='Username or email'
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        <button type="submit" className="submit">
          Log In</button>
        <button className="submit" id="demo-user" onClick={demoLogin}>
          Log In as Demo User</button>
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