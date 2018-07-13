import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";
import Home from "./Home";
import Notebook from "./Notebooks";
import AddNotebook from "./AddNotebook";
import Secret from "./Secret";
import Login from "./Login";
import Signup from "./Signup";
import api from "../api";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    };
    api.loadUser();
  }

  handleLogoutClick(e) {
    api.logout();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React Notebooks</h1>
          <Link to="/">Home</Link>
          <Link to="/notebooks">Notebooks</Link>
          <Link to="/add-notebook">Add Notebook</Link>
          {!api.isLoggedIn() && <Link to="/signup">Signup</Link>}
          {!api.isLoggedIn() && <Link to="/login">Login</Link>}
          {api.isLoggedIn() && (
            <Link to="/" onClick={e => this.handleLogoutClick(e)}>
              Logout
            </Link>
          )}
          <Link to="/secret">Secret</Link>
        </header>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/notebooks" component={Notebook} />
          <Route path="/add-notebook" component={AddNotebook} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/secret" component={Secret} />
          <Route render={() => <h2>404</h2>} />
        </Switch>
      </div>
    );
  }
}

export default App;
