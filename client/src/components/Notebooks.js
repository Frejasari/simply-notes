import React, { Component } from "react";
import api from "../api";

class Notebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    };
  }
  componentDidMount() {
    api
      .getNotebooks()
      .then(notebooks => {
        console.log("GET NOTEBOOKS CALLED", notebooks);
        this.setState({
          notebooks: notebooks
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="Notebooks">
        <h2>List of notebooks</h2>
        {this.state.notebooks.map((c, i) => <li key={i}>{c.title}</li>)}
      </div>
    );
  }
}

export default Notebook;
