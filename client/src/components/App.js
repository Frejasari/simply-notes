import React, { Component } from "react";
import { Route, Link, Switch } from "react-router-dom";
import Navigation from "./Navigation";
import Home from "./Home";
import NotebookList from "./NotebookList";
import AddNotebook from "./AddNotebook";
import Secret from "./Secret";
import Login from "./Login";
import Signup from "./Signup";
import api from "../api";

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
      <div>
        {api.isLoggedIn() && <Navigation />}
        <Navigation />
        <section className="content container">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/notebooks" exact component={NotebookList} />
            <Route path="/add-notebook" component={AddNotebook} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/secret" component={Secret} />
            <Route render={() => <h2>404</h2>} />
          </Switch>
        </section>
      </div>
    );
  }
}

export default App;
