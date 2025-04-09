import { useContext, useState } from 'react';
// import axios from 'axios';
import { auth } from '../../../backend/utils/middleware';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Auth from '../contexts/Auth';

const defForm = { name: '', password: '' };

function Login() {
  const [form, setForm] = useState(defForm);
  const { setUser } = useContext(Auth);
  const { setLoginForm } = useAuth(setUser)

  const handleLogin = e => {
    setForm(f => {
      return { ...f, [e.target.name]: e.target.value }
    });
    // axios.post('/login', { name, password })
    //   .then(res => {
    //     console.log('Prisijungta!', res.data);
    //   })
    //   .catch(err => {
    //     console.log('Nepavyko prisijungti', err.response?.data);
    //   });
  }

  const login = _ => {
    setLoginForm(form);
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Prisijungimas</h2>
      <div className="login-page__box__row">
        <label>Name</label>
        <input type="text" placeholder="Name" value={form.name} onChange={handleLogin} />
      </div>
      <div className="login-page__box__row">
        <label>Password</label>
        <input type="password" placeholder="Password" value={password} onChange={handleLogin} />
      </div>
      <div className="login-page__box__row">
        <button type="submit" onClick={login}>Login</button>
      </div>
      <div className="login-page__box__row">
        <NavLink to='/' end>Go to Home</NavLink>
      </div>
    </form>
  );
}

export default Login;
