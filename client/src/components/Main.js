import React, { Component } from "react";
import { Route } from "react-router-dom";
import NotebookList from "./NotebookList";
import NotebookDetails from "./NotebookDetails";
import Page from "./Page";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: window.innerWidth
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {
    this.setState({ screenWidth: window.innerWidth });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  // CAN I PASS CLASS NAMES THROUG ROUTES?
  getSmallScreenSetup() {
    return (
      <div className="row">
        <div className="col-12">
          <Route path="/notebooks" exact component={NotebookList} />
          <Route path="/notebooks/:notebookId" exact component={NotebookDetails} />
          <Route path="/notebooks/:notebookId/pages/:pageId" exact component={Page} />
        </div>
      </div>
    );
  }
  getMediumScreenSetup() {
    console.log("MEDIUM");
    return (
      <div className="row">
        <div className="col-6">
          <Route path="/notebooks" exact component={NotebookList} />
          <Route path="/notebooks/:notebookId" exact component={NotebookList} />
        </div>
        <div className="col-6">
          <Route path="/notebooks/:notebookId" exact component={NotebookDetails} />
        </div>
        <div className="col-4">
          <Route path="/notebooks/:notebookId/pages/:pageId" exact component={NotebookDetails} />
        </div>
        <div className="col-8">
          <Route path="/notebooks/:notebookId/pages/:pageId" exact component={Page} />
        </div>
      </div>
    );
  }
  getLargeScreenSetup() {
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
  render() {
    // WIDHT 1200 --> Show only one page not everyhing
    // 768px --> Always show another page
    if (this.state.screenWidth && window.innerWidth >= 1200) return this.getLargeScreenSetup();
    if (this.state.screenWidth && window.innerWidth >= 768) return this.getMediumScreenSetup();
    return this.getSmallScreenSetup();
  }
}

export default Main;
