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

class NavDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }
  toggleDropdown(event) {
    event.preventDefault();
    this.setState(prevState => ({ isShown: !prevState.isShown }));
  }
  render() {
    const classDropownMenu = "dropdown-menu" + (this.state.isShown ? " show" : "");
    return (
      <li className="nav-item dropdown">
        <Link
          className="nav-link dropdown-toggle"
          to="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          tabIndex="0"
          onClick={this.toggleDropdown}
        >
          {this.props.name}
        </Link>
        <div className={classDropownMenu} aria-labelledby="navbarDropdown" onClick={this.toggleDropdown}>
          {this.props.children}
        </div>
      </li>
    );
  }
}

class Navigation extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm fixed-top navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Navbar
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
            <NavItem path="/">Home</NavItem>
            <NavItem path="/notebooks">Notebooks</NavItem>
            {!api.isLoggedIn() && <NavItem path="/login">Login</NavItem>}
            <NavDropdown name="Create">
              <Link className="dropdown-item" to="/add-notebook">
                Notebook
              </Link>
              <Link className="dropdown-item" to="/add-page">
                Page
              </Link>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="#">
                Something else here
              </a>
            </NavDropdown>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
    );
  }
}

export default Navigation;
