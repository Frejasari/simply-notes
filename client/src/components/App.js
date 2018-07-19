import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Navigation from "./Navigation";
import Home from "./Home";
import Main from "./Main";
import AddNotebook from "./AddNotebook";
import Login from "./Login";
import Signup from "./Signup";
import api from "../api";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faPencilAlt, faPen, faAngleDown, faSave } from "@fortawesome/free-solid-svg-icons";

library.add(faPlus, faPencilAlt, faPen, faAngleDown, faSave);

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
        <section className="content container-fluid">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/notebooks" component={Main} />
            <Route path="/add-notebook" component={AddNotebook} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route render={() => <h2>404</h2>} />
          </Switch>
        </section>
      </div>
    );
  }
}

export default App;
