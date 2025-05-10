import { useEffect, useReducer } from "react";
import registrationReducer from "../reducers/registrationReducer";
import axios from 'axios';
import * as C from '../constants/main';
import * as A from '../constants/action';


export default function useRegistration() {

  const [regForm, dispatchRegForm] = useReducer(registrationReducer, null);

  useEffect(_ => {
    axios.post(C.SERVER_URL + '/register')
      .then(res => {
        dispatchRegForm({
          type: A.REGISTER_NEW_ACCOUNT,
          payload: res.data.db
        })
      })
      .catch(err => {
        console.log("No bueno my friend, register didn't go as planned.",err);
      })
  }, []);
  
  return {regForm, dispatchRegForm}
}