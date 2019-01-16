import React from 'react';
import { NavLink } from 'react-router-dom';

import logo from '../../logo.svg';

import AuthContext from '../../context/auth-context';
import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <img src={logo} className="App-logo" alt="logo" style={{height: 100 + 'px'}} />
            <h1>Booker</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              {!context.token && (
                <li><NavLink to="/auth">Auth</NavLink></li>
              )}
              <li><NavLink to="/events">Events</NavLink></li>
              {context.token && (
                <li><NavLink to="/bookings">Bookings</NavLink></li>
              )}

            </ul>
          </nav>
        </header>
      )
    }
  }

  </AuthContext.Consumer>
);

export default mainNavigation;
