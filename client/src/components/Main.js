import React, { Component } from "react";
import { Route } from "react-router-dom";
import NotebookList from "./NotebookList";
import NotebookDetails from "./NotebookDetails";
import Page from "./Page";
import api from "../api";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faPencilAlt, faPen } from "@fortawesome/free-solid-svg-icons";

library.add(faPlus, faPencilAlt, faPen);

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
      <div className="row">
        <div className="col-2">
          <Route path="/notebooks" component={NotebookList} />
        </div>
        <div className="col-2">
          <Route path="/notebooks/:notebookId" component={NotebookDetails} />
        </div>
        <div className="col-8">
          <Route path="/notebooks/:notebookId/pages/:pageId" exact component={Page} />
        </div>
      </div>
    );
  }
}

export default App;
