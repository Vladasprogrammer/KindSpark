import * as A from '../constants/action';


export default function usersReducer(state, action) {

  let newState;
  
  switch (action.type) {
    case A.LOAD_ACTIVE_USERS_FROM_SERVER:
      newState = action.payload;
      break;
  
    default: newState = state;
      break;
  }
  
  return newState;
}