import React, { Component } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PageListItem = props => {
  return (
    <li>
      <Link to={`/notebooks/sites/${props.page._id}`}>{props.page.title}</Link>
      <p>{props.page.description}</p>
    </li>
  );
};

class NotebookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebook: null
    };
  }
  componentDidMount() {
    api
      .getNotebook(this.props.match.params.notebookId)
      .then(notebook => {
        console.log("GET NOTEBOOK CALLED", notebook._sites);
        this.setState({
          notebook: notebook
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    if (!this.state.notebook) return <div>loading....</div>;
    const notebook = this.state.notebook;
    return (
      <div className="Notebooks">
        <h2>{notebook.title}</h2>
        <p>{notebook.description}</p>
        <ul>{notebook._sites.map(page => <PageListItem page={page} key={page._id} />)}</ul>
      </div>
    );
  }
}

export default NotebookDetails;
