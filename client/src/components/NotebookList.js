import React, { Component } from "react";
import api from "../api";
import NotebookListItem from "./ListItemWithEditAndLink";

class NotebookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: []
    };
    this.handleEditClick = this.handleEditClick.bind(this);
  }
  handleEditClick(e) {
    console.log("HANDLE EDIT CLICK", e.target.id);
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
          <NotebookListItem
            data={notebook}
            link={`/notebooks/${notebook._id}`}
            handleEditClick={this.handleEditClick}
            key={notebook._id}
          />
        ))}
      </div>
    );
  }
}

export default NotebookList;
