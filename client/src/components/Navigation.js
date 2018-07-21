import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import api from "../api";

const NavItem = props => (
  <li>
    <NavLink to={props.path} exact>
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
      <nav className="custom-navbar fixed-top ">
        <a className="" href="#">
          <img src="/images/SimplyNotesLogo.svg" width="30" height="30" alt="" />
        </a>
        <div>
          <ul className="">
            {api.isLoggedIn() && <NavItem path="/notebooks">Notebooks</NavItem>}
            {!api.isLoggedIn() && <NavItem path="/login">Login</NavItem>}
            {!api.isLoggedIn() && <NavItem path="/signup">Signup</NavItem>}

            {api.isLoggedIn() && (
              <li className="nav-item">
                <Link to="/" onClick={e => this.handleLogoutClick(e)}>
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
