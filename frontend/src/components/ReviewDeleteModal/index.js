import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import './ReviewDeleteModal.css'
import { deleteReviewThunk } from '../../store/review';
import { useDispatch } from 'react-redux';
import { useState } from "react";

export default function DeleteReviewModal({ userReview, spotId }) {

  const { closeModal } = useModal();
  const history = useHistory();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);

  const handleReturn = e => {
    e.preventDefault();
    closeModal()
  }

  const handleDelete = async () => {
    const deleteResponse = await dispatch(deleteReviewThunk(userReview.id))
    if (deleteResponse.ok) {
      closeModal();
      history.push(`/spots/${spotId}`)
    } else {
      setErrors([deleteResponse.message])
    }
  }

  return (
    <div className='delete-modal'>
      <h1>Confirm Delete</h1>
      <h3 className='delete-confirm-header'>Are you sure you want to delete this review?</h3>
      <div className='delete-confirm-buttons'>
        <button className='yes-delete'
          onClick={handleDelete}>Yes <span className='delete-span'>(delete review)</span></button>
        <button className='no-delete'
          onClick={handleReturn}>No <span className='delete-span'>(keep review)</span>
        </button>
      </div>
    </div>
  )
}