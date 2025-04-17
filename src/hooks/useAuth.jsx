import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import * as C from '../constants/main';

export default function useAuth(setUser) {
  const [loginForm, setLoginForm] = useState(null);
  const navigate = useNavigate();

  const getUser = _ => {

    axios.get(C.SERVER_URL + 'auth-user', { withCredentials: true })
    .then(res => {
      console.log(res.data);
      setUser(res.data);
    })
    .catch(err => {
      console.log(err);
    })

    useEffect( _ => {
      if (null === loginForm) {
        return;
      }
      axios.post(C.SERVER_URL + 'login', loginForm, { withCredentials: true })
      .then(res => {
        console.log(res.data);
        setUser(res.data.user);
        navigate(C.GO_AFTER_LOGIN);
      })
      .catch(err => {
        console.log(err);
      })
    }, [loginForm]);
  };


  return { setLoginForm, getUser };
}