import React, { Component } from "react";
import api from "../api";
import NotebookListItem from "./ListItemWithEditAndLink";

class NotebookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    };
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  handleSaveClick(notebookId, title, description) {
    api.editNotebook(notebookId, { title, description }).then(res => {
      this.setState({ notebooks: res.notebooks });
    });
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
        {this.state.notebooks.map(notebook => (
          <NotebookListItem
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
