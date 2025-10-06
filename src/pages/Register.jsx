import { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as C from '../constants/main';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = e => {
    e.preventDefault();
    console.log({ username, email, password });
    axios.post(C.SERVER_URL + 'register', { username, email, password }, { withCredentials: true })
      .then(res => {
        console.log('Registruota!', res.data);
        navigate(C.GO_AFTER_REGISTER)
      })
      .catch(err => {
        console.log('Nepavyko registruotis');
        if (err.response) {
          console.log('Status:', err.response.status);
          console.log('Data:', err.response.data);
        } else if (err.request) {
          console.log('No response received:', err.request);
        } else {
          console.log('Error message:', err.message);
        }
      });
  }

  return (
    <div className="register-container">
      <div className="wrapper">

        <h2 className="register-title">Spark up</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="register-form__field">
            <label htmlFor="username">User Name</label>
            <div className="input-with-icons">
              <input
                className="input-field"
                type="text"
                name="username"
                placeholder="Your Name"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <FontAwesomeIcon
                icon="fa-solid fa-user"
                className="input-icon"
              />
            </div>
          </div>
          <div className="register-form__field">
            <label htmlFor="email">Email</label>
            <div className="input-with-icons">
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <FontAwesomeIcon
                icon="fa-solid fa-envelope"
                className="input-icon"
              />
            </div>
          </div>
          <div className="register-form__field">
            <label htmlFor="password">Password</label>
            <div className="input-with-icons">
              <input
                className="input-field"
                type="password"
                placeholder="Create password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon="fa-solid fa-lock"
                className="input-icon"
              />
            </div>
          </div>
          <button className="register-form__button" type="submit">Register</button>
          <div className="register-form__columns">
            <NavLink to="/login" end>Log in</NavLink>
          </div>
          <div className="register-form__columns">
            <NavLink to="/" end>Home page</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
