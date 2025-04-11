import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { AuthContext } from '../contexts/Auth';

const defForm = { name: '', password: '' };

function Login() {
  const [form, setForm] = useState(defForm);
  const { setUser } = useContext(AuthContext);
  const { setLoginForm } = useAuth(setUser);

  const handleLogin = e => {
    setForm(f => ({
      ...f, 
      [e.target.name]: e.target.value
    }));
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3333/login', {
        name: form.name,
        password: form.password
      }, {
        withCredentials: true
      });
      setUser(res.data.user);
      window.location.href = '/projects';
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form>
      <h2>Login to Kind Spark</h2>
      <div className="login-page__box__row">
        <label>Name</label>
        <input 
          type="text"
          name="name"
          placeholder="Name" 
          value={form.name} 
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
        <button type="submit" onClick={login}>Login</button>
      </div>
      <div className="login-page__box__row">
        <NavLink to='/' end>Go to Home</NavLink>
      </div>
    </form>
  );
}

export default Login;