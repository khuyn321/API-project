import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './SpotDeleteModal.css'
import { deleteASpot } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useState } from "react";

export default function SpotDeleteModal({ spotId }) {

  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleReturn = e => {
    e.preventDefault();
    closeModal()
  }

  const handleDelete = async () => {
    const deleteResponse = await dispatch(deleteASpot(spotId))
    if (deleteResponse.ok) {
      closeModal();
      history.push("/spots/current")
    } else {
      setErrors([deleteResponse.message])
    }
  }

  return (
    <div className='delete-modal'>
      <h1>Confirm Delete</h1>
      <h3 className='delete-confirm-header'>Are you sure you want to delete this spot?</h3>
      <div className='delete-confirm-buttons'>
        <button className='yes-delete'
          onClick={handleDelete}>Yes <span className='delete-span'>(delete spot)</span></button>
        <button className='no-delete'
          onClick={handleReturn}>No <span className='delete-span'>(keep spot)</span>
        </button>
      </div>
    </div>
  )
}