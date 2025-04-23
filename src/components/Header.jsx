import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router';
import Auth from '../contexts/Auth';
import { HIDE_NAV_PATHS } from '../constants/main';


export default function Header() {

  const { pathname } = useLocation();

  const { user } = useContext(Auth);

  if (HIDE_NAV_PATHS.includes(pathname)) {
    return null;
  }

  if ( !user ) return null;

  return (
    <header>
      <nav>
        <ul>
          <div className='nav-left'>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/stories">Stories</NavLink></li>
            <li><NavLink to="/new-story">Share Your Story</NavLink></li>
          </div>
          <div className='nav-right'>
            {
              user.role === 'guest' && <NavLink to='/login' end>Login</NavLink>
            }
            {
              user.role !== 'guest' &&
              <>
                <div className="nav-right__username">{user.username}</div>
                <NavLink to='/logout' end>Logout</NavLink>
              </>
            }
            <li><NavLink to="/register">Register</NavLink></li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

