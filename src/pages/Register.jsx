import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = (e) => {
    axios.post('/register', { email, password, username }, { withCredentials: true })
      .then(res => {
        console.log('Registruota!', res.data);
        window.location.href = '/login';
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
