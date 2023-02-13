import React, { useState } from "react";
import "./LandingPageHeader.css";
import { Link } from 'react-router-dom'
import { useDispatch } from "react-redux";;


function displayHomePage() {
  // const dispatch = useDispatch();
  // const [credential, setCredential] = useState("");
  // const [password, setPassword] = useState("");
  // const [errors, setErrors] = useState([]);
  // const { closeModal } = useModal();
  // console.log(SpotIndex)

  return (
    <>
      {/* <SpotIndex /> */}
      {/* <h1>Not sure where to go? Perfect.</h1> */}
      {/* <Link rel="icon" type="image/x-icon" href="/favicon.ico" /> */}
      <hr className="navline"></hr>
      {/* <div> */}
      {/* <button className="btn">I'm flexible</button> */}
      {/* </div> */}
    </>
  );
}

export default displayHomePage;