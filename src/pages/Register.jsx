import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('/register', { email, password, name })
      .then(res => {
        console.log('Registruota!', res.data);
      })
      .catch(err => {
        console.log('Nepavyko registruotis', err.response?.data);
      });
  }

  return (
    <form >
      <h2>Registracija</h2>
      <input type="text" placeholder="Vardas" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="El. paštas" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Slaptažodis" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" onSubmit={handleRegister}>Registruotis</button>
    </form>
  );
}

export default Register;
