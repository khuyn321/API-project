import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = 'spots/getAllSpots'
const GET_A_SPOT = 'spots/getASpot'
const CREATE = 'spots/createSpot'
const CREATE_SPOT_IMG = 'spots/createSpotImg'
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

export const actionCreateSpotImg = (spot) => ({
  type: CREATE_SPOT_IMG,
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
    dispatch(actionGetAllSpots(payload.Spots))
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

export const createSpotImg = (spotImage) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotImage.spotId}/images`, {
    method: 'POST',
    body: JSON.stringify(spotImage)
  })

  if (res.ok) {
    const payload = await res.json()
    dispatch(actionCreateSpotImg(payload))
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
    dispatch(actionDeleteSpot(payload))
    return payload
  }
}

const initialState = { allSpots: {}, singleSpot: {} }

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const newState = { allSpots: {}, singleSpot: {} };
      action.spots.forEach(spot => {
        newState.allSpots[spot.id] = spot
      })
      return newState
    }
    case GET_A_SPOT: {
      const newState = { ...state, singleSpot: action.spot }
      return newState
    }
    case CREATE: {
      const newState = { allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } };
      newState.singleSpot = action.spot;
      return newState
    }
    case CREATE_SPOT_IMG: {
      const newState = { allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } };
      newState.singleSpot = action.spot;
      return newState
    }
    case DELETE: {
      const newState = { allSpots: { ...state.allSpots }, singleSpot: { ...state.singleSpot } } //! <--
      newState.singleSpot[action.spotId] = {}
      //!^ ^ ^ set to an empty obj instead to reset
    }
    case RESET:
      return initialState
    default:
      return state
  }
}

  // console.log("SPOT FROM THUNK: " + spot)
  // console.log("SPOTID FROM THUNK: " + spotId)
  // console.log("SPOTIMAGE FROM THUNK: " + spotImage)
  // console.log("URL FROM THUNK: " + url)
  // console.log("IMAGEURL FROM THUNK: " + imageUrl)
  // console.log("SPOTIMAGE FROM THUNK: " + spotImage)

// // This file will contain all the actions specific to the
// // session user's information and the session user's Redux reducer.

  // console.log("IN THE THUNK:", id)


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
