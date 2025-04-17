import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
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
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

