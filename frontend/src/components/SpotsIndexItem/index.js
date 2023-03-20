import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
// import { actionDeleteSpot } from '../store/Spots'

const SpotIndexItem = ({ Spot }) => {
  const dispatch = useDispatch();

  const deleteSpot = (e) => {
    e.preventDefault();
    dispatch(actionDeleteSpot(Spot.id))
  };

  return (
    <li>
      <Link to={`/Spots/${Spot.id}`}>Spot #{Spot.id}</Link>
      {/* <Link to={`/Spots/${Spot.id}/edit`}>Edit</Link> */}
      <button onClick={deleteSpot}>Delete</button>
    </li>
  );
};

export default SpotIndexItem;
