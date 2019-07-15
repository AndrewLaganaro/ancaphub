import { GET_ALL_USERS_SUCCESS, GET_USER_SUCCESS } from '../utils/types'

const initialState = {
  allUsers: [],
  user: {},
  userLibrary: {},
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        allUsers: action.payload
      }
    case GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state;
  }
}