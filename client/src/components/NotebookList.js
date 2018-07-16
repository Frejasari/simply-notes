import React, { Component } from "react";
import { Link } from "react-router-dom";
import api from "../api";

class NotebookList extends Component {
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
        {this.state.notebooks.map(notebook => (
          <li key={notebook._id}>
            <Link to={`/notebooks/${notebook._id}`}>{notebook.title}</Link>
          </li>
        ))}
      </div>
    );
  }
}

export default NotebookList;
