import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'review/getReviews'
const CREATE_REVIEW = 'review/createReview'
const EDIT_REVIEW = 'review/editReview'
const DELETE_REVIEW = 'review/deleteReview'

/*****************/
// CRUD Action creators
/*****************/
const actionGetReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
}
const actionCreateReview = (reviews) => {
  return {
    type: CREATE_REVIEW,
    reviews
  }
}
const actionEditReview = (reviews) => {
  return {
    type: EDIT_REVIEW,
    reviews
  }
}
const actionDeleteReview = (reviews) => {
  return {
    type: DELETE_REVIEW,
    reviews
  }
}

/*****************/
// Thunks
/*****************/
export const getReviewsThunk = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const payload = await res.json();
    console.log("THIS IS MY THUNK PAYLOAD: ", payload)
    dispatch(actionGetReviews(payload.Reviews));
    return payload
  }

}
export const createReviewThunk = (spotId, review) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review)
  });

  if (res.ok) {
    const payload = await res.json();
    dispatch(actionCreateReview
      (payload));
    return payload
  }

}
export const editReviewThunk = (reviewId, review) => async dispatch => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(review)
  });


  if (res.ok) {
    const payload = await res.json();
    dispatch(actionEditReview(payload));
    return payload
  }

}
export const deleteReviewThunk = (reviewId) => async dispatch => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    const payload = await res.json();
    dispatch(actionDeleteReview(payload));
    return payload
  }

}

const initialState = {}

/*****************/
// Reducer
/*****************/

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS: {
      const newState = {};
      action.reviews.forEach(review => {
        newState[review.id] = review
      })
      return newState

      // const newState = { ...state };
      // return newState
    }
    case CREATE_REVIEW: {
      const newState = { ...state };
      return newState
    }
    case EDIT_REVIEW: {
      const newState = { ...state }
      return newState
    }
    default:
      return state
  }
}

export default reviewsReducer