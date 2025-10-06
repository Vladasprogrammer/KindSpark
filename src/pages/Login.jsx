import { useContext, useState } from "react";
import { NavLink } from "react-router";
import useAuth from "../hooks/useAuth";
import Auth from "../contexts/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const defForm = { username: "", password: "" };

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
    <div className="login-container">
      <div className="wrapper">
        <h2 className="login-title">Spark in</h2>
        <form className="login-form">
          <div className="login-form__field">
            <label htmlFor="username">Name</label>
            <div className="input-with-icon">
              <input
                className="input-field"
                type="text"
                name="username"
                placeholder="Enter your name"
                value={form.username}
                onChange={handleLogin}
              />
              <FontAwesomeIcon icon="fa-solid fa-user" className="input-icon" />
            </div>
          </div>
          <div className="login-form__field">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input
                className="input-field"
                type="password"
                name="password"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleLogin}
              />
              <FontAwesomeIcon icon="fa-solid fa-lock" className="input-icon" />
            </div>
          </div>
          <button className="login-form__button" type="submit" onClick={doLogin}>Login</button>
          <div className="login-form__columns">
            <NavLink to="/register" className="login-form__link" end>Create account?</NavLink>
          </div>
          <div className="login-form__columns">
            <NavLink to="/" className="login-form__link" end>Home page</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

