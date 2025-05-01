import { useEffect, useReducer } from "react";
import * as C from '../constants/main';
import * as A from '../constants/action';
import axios from 'axios';
import usersReducer from "../reducers/usersReducer";


export default function useUsers() {
  const [users, dispatchUsers] = useReducer(usersReducer, null);
  
  useEffect(_ => {
    axios.get(C.SERVER_URL + 'users/active-list')
    .then(res => {
      dispatchUsers({
        type: A.LOAD_ACTIVE_USERS_FROM_SERVER,
        payload: res.data.db
      });
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return {users, dispatchUsers};
}