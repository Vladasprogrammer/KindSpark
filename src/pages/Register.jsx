import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import * as C from '../constants/main';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = (e) => {
    axios.post('/register', { username, email, password }, { withCredentials: true })
      .then(res => {
        console.log('Registruota!', res.data);
        navigate(C.GO_AFTER_REGISTER)
      })
      .catch(err => {
        console.log('Nepavyko registruotis', err.response?.data);
      });
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Registration</h2>
      <input type="text" placeholder="Your Name" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="email" placeholder="Your Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
