import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { Redirect } from 'react-router-dom';
import './SignupForm.css';

function SignupFormModal({ setShowModal }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-form-container">
          <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <div className="signup-form-EMAIL-container">

            <label>
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="signup-form-USERNAME-container">
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="signup-form-FIRSTNAME-container">
            <label>
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="signup-form-LASTNAME-container">

            <label>
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="signup-form-PASSWORD-container">
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="signup-form-CONFIRMPASSWORD-container">
            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button
            id="form-submit-button"
            type="submit"
            disabled={
              email.length < 1 ||
              username.length < 4 ||
              firstName.length < 1 ||
              lastName.length < 1 ||
              password.length < 6 ||
              password !== confirmPassword
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal



  // const handleDisable = useEffect(() => {
  //   let isDisabled = false;

  //   if (email.length === 0 ||
  //     username.length === 0 ||
  //     firstName.length === 0 ||
  //     lastName.length === 0 ||
  //     password.length === 0 ||
  //     confirmPassword.length === 0) {
  //     isDisabled = true
  //   }
  //   return isDisabled

  // const button = document.getElementById("form-submit-button")
  // if (button) {
  //   button.disabled = isDisabled
  // }
  // }, [email, username, firstName, lastName, password, confirmPassword])

  // const disableButton = () => {
  // if (email.length === 0 ||
  //   username.length === 0 ||
  //   firstName.length === 0 ||
  //   lastName.length === 0 ||
  //   password.length === 0 ||
  //   confirmPassword.length === 0
  //   ) {
  //     return true
  //   }

  // }
