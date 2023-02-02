import { csrfFetch } from "./csrf";

const CREATE = ''

// thunk action to grab all spots
// export const readThunk = () => async (dispatch) => {
//   const res = await csrfFetch('/api/spots')
//   if (res.ok) {
//       const spots = await res.json()
//       dispatch((actionReadSpots(spots)))
//   }
// }


// // This file will contain all the actions specific to the
// // session user's information and the session user's Redux reducer.

// import { csrfFetch } from './csrf';

// const SET_USER = 'session/setUser';
// const REMOVE_USER = 'session/removeUser';

// const setUser = (user) => {
//   return {
//     type: SET_USER,
//     payload: user,
//   };
// };

// const removeUser = () => {
//   return {
//     type: REMOVE_USER,
//   };
// };

// export const getSpots = (spot) => async (dispatch) => {
//   const { username, firstName, lastName, email, password } = spot;
//   const response = await csrfFetch("/api/users", {
//     method: "POST",
//     body: JSON.stringify({
//       username,
//       firstName,
//       lastName,
//       email,
//       password,
//     }),
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };

// export const login = (user) => async (dispatch) => {
//   const { credential, password } = user;
//   const response = await csrfFetch('/api/session', {
//     method: 'POST',
//     body: JSON.stringify({
//       credential,
//       password,
//     }),
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };

// export const logout = () => async (dispatch) => {
//   const response = await csrfFetch('/api/session', {
//     method: 'DELETE',
//   });
//   dispatch(removeUser());
//   return response;
// };

// const initialState = { user: null };

// const sessionReducer = (state = initialState, action) => {
//   let newState;
//   switch (action.type) {
//     case SET_USER:
//       newState = Object.assign({}, state);
//       newState.user = action.payload;
//       return newState;
//     case REMOVE_USER:
//       newState = Object.assign({}, state);
//       newState.user = null;
//       return newState;
//     default:
//       return state;
//   }
// };

// export const restoreUser = () => async dispatch => {
//   const response = await csrfFetch('/api/session');
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };
// // ...

// export default sessionReducer;

// import --> actions --> thunks --> reducer

/**
  spots: {
    // Notice there are two slices of state within spots. This is to handle your two different routes for getting a spot.
    // Refer to your API Docs to get more information.
    allSpots: {
      [spotId]: {
        spotData,
      },
      // These optional ordered lists are for you to be able to store an order in which you want your data displayed.
      // you can do this on the frontend instead of in your slice is state which is why it is optional.
      optionalOrderedList: [],
    },
    // Notice singleSpot has more data that the allSpots slice. Review your API Docs for more information.
    singleSpot: {
      spotData,
      SpotImages: [imagesData],
      Owner: {
        ownerData,
      },
    },
  },
  // Again the idea here is two have separate slices for the different data responses you receive from your routes.
  // For example, you could use each of these slices specifically for the component you are dealing with on the frontend.

  spots: {
    // Notice there are two slices of state within spots. This is to handle your two different routes for getting a spot.
    // Refer to your API Docs to get more information.
    allSpots: {
      [spotId]: {
        spotData,
      },
      // These optional ordered lists are for you to be able to store an order in which you want your data displayed.
      // you can do this on the frontend instead of in your slice is state which is why it is optional.
      optionalOrderedList: [],
    },
    // Notice singleSpot has more data that the allSpots slice. Review your API Docs for more information.
    singleSpot: {
      spotData,
      SpotImages: [imagesData],
      Owner: {
        ownerData,
      },
    },
  },
  // Again the idea here is two have separate slices for the different data responses you receive from your routes.
  // For example, you could use each of these slices specifically for the component you are dealing with on the frontend.

  spots: {
    // Notice there are two slices of state within spots. This is to handle your two different routes for getting a spot.
    // Refer to your API Docs to get more information.
    allSpots: {
      [spotId]: {
        spotData,
      },
      // These optional ordered lists are for you to be able to store an order in which you want your data displayed.
      // you can do this on the frontend instead of in your slice is state which is why it is optional.
      optionalOrderedList: [],
    },
    // Notice singleSpot has more data that the allSpots slice. Review your API Docs for more information.
    singleSpot: {
      spotData,
      SpotImages: [imagesData],
      Owner: {
        ownerData,
      },
    },
  },
  // Again the idea here is two have separate slices for the different data responses you receive from your routes.
  // For example, you could use each of these slices specifically for the component you are dealing with on the frontend.

  spots: {
    // Notice there are two slices of state within spots. This is to handle your two different routes for getting a spot.
    // Refer to your API Docs to get more information.
    allSpots: {
      [spotId]: {
        spotData,
      },
      // These optional ordered lists are for you to be able to store an order in which you want your data displayed.
      // you can do this on the frontend instead of in your slice is state which is why it is optional.
      optionalOrderedList: [],
    },
    // Notice singleSpot has more data that the allSpots slice. Review your API Docs for more information.
    singleSpot: {
      spotData,
      SpotImages: [imagesData],
      Owner: {
        ownerData,
      },
    },
  },
  // Again the idea here is two have separate slices for the different data responses you receive from your routes.
  // For example, you could use each of these slices specifically for the component you are dealing with on the frontend.

 */