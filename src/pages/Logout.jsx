import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import * as C from '../constants/main';
import Auth from '../contexts/Auth';


export default function Logout() {

  const navigate = useNavigate();
  const { setUser } = useContext(Auth);

  useEffect(_ => {
    axios.post(C.SERVER_URL + 'logout', {}, { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
        navigate(C.GO_AFTER_LOGOUT);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);


  return (
    <span>Logging out...</span>
  );

};