import React, { Component } from "react";
import api from "../api";

class AddNotebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      capitals: "",
      area: "",
      description: "",
      message: null
    };
  }

  handleInputChange(stateFieldName, event) {
    let newState = {};
    newState[stateFieldName] = event.target.value;

    this.setState(newState);
  }

  handleClick(e) {
    e.preventDefault();
    console.log(this.state.name, this.state.description);
    let data = {
      name: this.state.name,
      capitals: this.state.capitals,
      area: this.state.area,
      description: this.state.description
    };
    api
      .postCountries(data)
      .then(result => {
        console.log("SUCCESS!");
        this.setState({
          title: "",
          description: "",
          message: `A new notebook '${this.state.title}' has been created`
        });
        setTimeout(() => {
          this.setState({
            message: null
          });
        }, 2000);
      })
      .catch(err => {
        console.log("ERROR");
      });
  }
  render() {
    return (
      <div className="AddNotebook">
        <h2>Add notebook</h2>
        <form>
          Title:{" "}
          <input
            type="text"
            value={this.state.title}
            onChange={e => {
              this.handleInputChange("name", e);
            }}
          />
          <br />
          Description{" "}
          <textarea
            value={this.state.description}
            cols="30"
            rows="10"
            onChange={e => {
              this.handleInputChange("description", e);
            }}
          />{" "}
          <br />
          <button onClick={e => this.handleClick(e)}>Create notebook</button>
        </form>
        <div
          style={{
            margin: 10,
            backgroundColor: "red",
            display: this.state.message ? "block" : "none"
          }}
        >
          {this.state.message}
        </div>
      </div>
    );
  }
}

export default AddNotebook;
