import React, { Component } from "react";
import api from "../api";
import PageListItem from "./ListItemWithEditAndLink";
import FormOverlayWithAddButton from "./FormOverlayWithAddButton";
import "./NotebookDetails.css";

class NotebookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebook: null
    };
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleAddPageClick = this.handleAddPageClick.bind(this);
  }
  handleAddPageClick(title, description) {
    if (title)
      api.createPage(this.state.notebook._id, { title, description }).then(res => {
        this.setState({ notebook: res.notebook });
      });
  }
  handleSaveClick(pageId, title, description) {
    if (title)
      api.editPage(pageId, { title, description }).then(res => {
        this.setState({ notebook: res.notebook });
      });
  }
  getNotebookFromApi() {
    api
      .getNotebook(this.props.match.params.notebookId)
      .then(notebook => {
        this.setState({
          notebook: notebook
        });
      })
      .catch(err => console.log(err));
  }
  componentDidMount() {
    this.getNotebookFromApi();
  }
  componentDidUpdate() {
    if (!this.state.notebook || this.props.match.params.notebookId !== this.state.notebook._id)
      this.getNotebookFromApi();
  }
  render() {
    if (!this.state.notebook) return <div>loading....</div>;
    const notebook = this.state.notebook;
    return (
      <div className={`${this.props.className} Notebooks`}>
        <FormOverlayWithAddButton headline="Add a new Page" handleSaveClick={this.handleAddPageClick} />
        {notebook._sites.map(page => (
          <PageListItem
            headline="Edit page"
            data={page}
            link={`/notebooks/${this.state.notebook._id}/pages/${page._id}`}
            key={page._id}
            handleSaveClick={(title, description) => this.handleSaveClick(page._id, title, description)}
          />
        ))}
      </div>
    );
  }
}

export default NotebookDetails;
