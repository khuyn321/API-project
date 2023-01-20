import React, { useState } from "react";
import "./HomePage.css";
import { useDispatch } from "react-redux";;

function displayHomePage() {
  // const dispatch = useDispatch();
  // const [credential, setCredential] = useState("");
  // const [password, setPassword] = useState("");
  // const [errors, setErrors] = useState([]);
  // const { closeModal } = useModal();

  return (
    <>
      <h1>Not sure where to go? Perfect.</h1>
      <div>
        <button className="btn">I'm flexible</button>
      </div>
    </>
  );
}

export default displayHomePage;