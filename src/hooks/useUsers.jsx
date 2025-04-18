import { useEffect, useReducer } from "react";
import * as C from '../constants/main';
import axios from 'axios';


export default function useUsers() {
  const [users, dispatchUsers] = useReducer(null);

  useEffect(_ => {
    axios.get(C.SERVER_URL + 'active-users-list')
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  return {users, dispatchUsers};
}