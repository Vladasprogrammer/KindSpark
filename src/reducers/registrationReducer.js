import * as A from '../constants/action';


export default function registrationReducer(state, action) {

  let newState;
  
  switch (action.type) {
    case A.REGISTER_NEW_ACCOUNT:
      newState = action.payload;
      break;
  
    default: newState = state;
      break;
  }
  
  return newState;
}