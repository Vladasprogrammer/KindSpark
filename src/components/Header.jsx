import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router';
import Auth from '../contexts/Auth';
import { HIDE_NAV_PATHS } from '../constants/main';


export default function Header() {

  const { pathname } = useLocation();

  const { user } = useContext(Auth);

  if (HIDE_NAV_PATHS.includes(pathname)) {
    return null;
  }

  if (!user) return null;

  return (
    <header>
      <nav>
        <div className="desktop-menu">
          <ul className="left">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/stories">Stories</NavLink></li>
            <li><NavLink to="/new-story">Share your story</NavLink></li>
          </ul>

          <ul className="logo">
            <li><NavLink to="/">Kindspark</NavLink></li>
          </ul>

          <ul className="right">
            {
              user.role === 'guest' &&
              <>
                <li><NavLink to='/login' end>Login</NavLink></li>
                <li><NavLink to='/register' end>Register</NavLink></li>
              </>
            }
            {
              user.role !== 'guest' &&
              <>
                <div className="right__avatar">
                  <img src={user.avatar} alt={user.name} />
                </div>
                <div className="right__username">{user.username}</div>
                <li><NavLink to='/logout' end>Logout</NavLink></li>
              </>
            }
            {
              user.role === 'admin' &&
              <>
                <li><NavLink to='/admin' end>Admin</NavLink></li>
              </>
            }
          </ul>
        </div>

        <div className="mobile-menu">
          <input type="checkbox" id="menu-toggle"></input>

          <label htmlFor="menu-toggle" className="hamburger">
            <div className="line" />
            <div className="line" />
            <div className="line" />
          </label>

          <div className="modal">
            <label htmlFor="menu-toggle" className="close">&#10006;</label>
            <ul className="left">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/stories">Stories</NavLink></li>
              <li><NavLink to="/new-story">Share your story</NavLink></li>
            </ul>

            <ul className="right">
              {
                user.role === 'guest' &&
                <>
                  <li><NavLink to='/login' end>Login</NavLink></li>
                  <li><NavLink to='/register' end>Register</NavLink></li>
                </>
              }
              {
                user.role !== 'guest' &&
                <>
                  <div className="right__avatar">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                  <div className="right__username">{user.username}</div>
                  <li><NavLink to='/logout' end>Logout</NavLink></li>
                </>
              }
              {
                user.role === 'admin' &&
                <>
                  <li><NavLink to='/admin' end>Admin</NavLink></li>
                </>
              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

