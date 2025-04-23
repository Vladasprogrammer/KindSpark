import { useContext, useState } from 'react';
import { NavLink } from 'react-router';
import useAuth from '../hooks/useAuth';
import Auth from '../contexts/Auth';

const defForm = { username: '', password: '' };

export default function Login() {
  const [form, setForm] = useState(defForm);
  const { setUser } = useContext(Auth);
  const { setLoginForm } = useAuth(setUser);

  const handleLogin = e => {
    setForm(f => {
      f = { ...f, [e.target.name]: e.target.value }
      return f;
    });
  };

  const doLogin = e => {
    e.preventDefault();
    setLoginForm(form);
  };

  

  return (
    <form>
      <h2>Login to Kind Spark</h2>
      <div className="login-page__box__row">
        <label>Name</label>
        <input
          type="text"
          name="username"
          placeholder="Name"
          value={form.username}
          onChange={handleLogin}
        />
      </div>
      <div className="login-page__box__row">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleLogin}
        />
      </div>
      <div className="login-page__box__row">
        <button type="submit" onClick={doLogin}>Login</button>
      </div>
      <div>
        <div className="login-page__box__row">
          <NavLink to='/' end>Go to Home</NavLink>
        </div>
        <div className="login-page__box__row">
          <NavLink to='/register' end>Create new account</NavLink>
        </div>
      </div>
    </form>
  );
}

