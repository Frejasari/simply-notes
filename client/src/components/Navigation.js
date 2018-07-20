import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import api from "../api";

const NavItem = props => (
  <li className="nav-item">
    <NavLink to={props.path} exact className="nav-link">
      {props.children}
    </NavLink>
  </li>
);

class Navigation extends Component {
  handleLogoutClick(e) {
    api.logout();
  }
  render() {
    return (
      <nav className="navbar navbar-expand-sm fixed-top navbar-light">
        <a className="navbar-brand" href="#">
          <img src="/images/SimplyNotesLogo.svg" width="30" height="30" alt="" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {api.isLoggedIn() && <NavItem path="/notebooks">Notebooks</NavItem>}
            {!api.isLoggedIn() && <NavItem path="/login">Login</NavItem>}
            {!api.isLoggedIn() && <NavItem path="/signup">Signup</NavItem>}

            {api.isLoggedIn() && (
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={e => this.handleLogoutClick(e)}>
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navigation;
