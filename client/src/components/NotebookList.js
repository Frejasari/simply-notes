import React, { Component } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const NotebookListItem = props => {
  console.log("PROPS", props);
  return (
    <li>
      <Link to={`/notebooks/${props.notebook._id}`}>{props.notebook.title}</Link>
      <p>{props.notebook.description}</p>
    </li>
  );
};

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
        {this.state.notebooks.map(notebook => <NotebookListItem notebook={notebook} key={notebook._id} />)}
      </div>
    );
  }
}

export default NotebookList;
