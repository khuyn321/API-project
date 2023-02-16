import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots'
const GET_A_SPOT = 'spots/getASpot'
const CREATE = 'spots/createSpot'
const EDIT = 'spots/editSpot'
const DELETE = 'spots/deleteSpot'
const RESET = 'spots/resetState'

/*****************/
// CRUD Action creators
/*****************/

export const actionGetAllSpots = (spots) => ({
  type: GET_ALL_SPOTS,
  spots
})

export const actionGetASpot = (spot) => ({
  type: GET_A_SPOT,
  spot
})

export const actionCreateSpot = (spot) => ({
  type: CREATE,
  spot
})

export const actionEditSpot = (spotId) => ({
  type: EDIT,
  spotId
})

export const actionDeleteSpot = (spotId) => ({
  type: DELETE,
  spotId
})

/*****************/
// Thunks
/*****************/

// action to grab all spots
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots')
  if (res.ok) {
    const payload = await res.json()
    dispatch(actionGetAllSpots(payload))
    return payload
  }
}

export const getASpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`)
  if (res.ok) {
    const payload = await res.json()
    dispatch(actionGetASpot(payload))
    return payload
  }
}

export const createSpot = (spot) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    body: JSON.stringify(spot)
  })

  if (res.ok) {
    const payload = await res.json()
    dispatch(actionCreateSpot(payload))
    return payload
  }
}

export const editASpot = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    body: JSON.stringify(spot)
  })

  if (res.ok) {
    const payload = await res.json()
    dispatch(editASpot(payload))
    return payload
  }
}

export const deleteASpot = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${id}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    const payload = await res.json()
    dispatch(editASpot(payload))
    return payload
  }
}

const initialState = { page: 1, size: 20 };

// function defaultState() {
//   const initialState = {}
//   initialSpots.forEach(spot => {
//     initialState[spot.id] = spot
//   })
//   return initialState
// }

/***
const GET_ALL_SPOTS = 'spots/getAllSpots'
const GET_A_SPOT = 'spots/getASpot'
const CREATE = 'spots/createSpot'
const EDIT = 'spots/editSpot'
const DELETE = 'spots/deleteSpot'
const RESET = 'spots/resetState'
 */

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      return action.spots
    }
    case GET_A_SPOT: {
      const newState = { ...state, aSpot: action.spot }
      return newState
    }
    case CREATE: {
      const newState = { ...state }
      return newState
    }
    case DELETE: {
      const newState = { ...state }
      delete newState.Spots[action.spotId]
      delete newState.aSpot
      return newState
    }
    case RESET:
      return initialState()
    default:
      return state
  }
}

// // This file will contain all the actions specific to the
// // session user's information and the session user's Redux reducer.