import React, { Component } from "react";
import api from "../api";
import PageListItem from "./ListItemWithEditAndLink";
import "./NotebookDetails.css";

class NotebookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebook: null
    };
    this.handleEditClick = this.handleEditClick.bind();
  }
  handleEditClick(e) {
    console.log("HANDLE EDIT CLICK", e.target.id);
  }
  componentDidMount() {
    api
      .getNotebook(this.props.match.params.notebookId)
      .then(notebook => {
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
      <div className={`${this.props.className} Notebooks`}>
        {notebook._sites.map(page => (
          <PageListItem
            data={page}
            link={`/notebooks/${this.state.notebook._id}/pages/${page._id}`}
            key={page._id}
            handleEditClick={this.handleEditClick}
          />
        ))}
      </div>
    );
  }
}

export default NotebookDetails;
