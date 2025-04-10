import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('/register', { email, password, name }, { withCredentials: true })
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
      <h2>Registracija</h2>
      <input type="text" placeholder="Vardas" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="El. paštas" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Slaptažodis" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Registruotis</button>
    </form>
  );
}

export default Register;
