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
  }
  handleSaveClick(pageId, title, description) {
    api.editPage(pageId, { title, description }).then(res => {
      this.setState({ notebook: res.notebook });
    });
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
        <FormOverlayWithAddButton headline="Add a new Page" handleAddClick={_ => this.createNewParagraph(0)} />
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
