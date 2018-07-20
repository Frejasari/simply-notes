import React, { Component } from "react";
import api from "../api";
import NotebookListItem from "./ListItemWithEditAndLink";
import FormOverlayWithAddButton from "./FormOverlayWithAddButton";

class NotebookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    };
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleAddNotebookClick = this.handleAddNotebookClick.bind(this);
  }
  handleSaveClick(notebookId, title, description) {
    api.editNotebook(notebookId, { title, description }).then(res => {
      this.setState({ notebooks: res.notebooks });
    });
  }
  handleAddNotebookClick(title, description) {
    if (title)
      api
        .createNotebooks({ title, description })
        .then(res => {
          console.log("RES", res);
          this.setState({ notebooks: res.notebooks });
        })
        .catch(err => console.log(err));
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
        <FormOverlayWithAddButton headline="Add a new Notebook" handleSaveClick={this.handleAddNotebookClick} />
        {this.state.notebooks.map(notebook => (
          <NotebookListItem
            className=""
            headline="Edit notebook"
            data={notebook}
            link={`/notebooks/${notebook._id}`}
            handleSaveClick={(title, description) => this.handleSaveClick(notebook._id, title, description)}
            key={notebook._id}
          />
        ))}
      </div>
    );
  }
}

export default NotebookList;
