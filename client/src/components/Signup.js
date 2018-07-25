import React, { Component } from "react";
import api from "../api";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import "./Login.css";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      message: null
    };
    api.isLoggedIn() && this.props.history.push("/");
  }

  handleInputChange(stateFieldName, event) {
    let newState = {};
    newState[stateFieldName] = event.target.value;

    this.setState(newState);
  }

  handleClick(e) {
    e.preventDefault();
    let data = {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password
    };
    if (data.email && data.name && data.password)
      api
        .signup(data)
        .then(result => {
          console.log("SUCCESS!");
          this.props.history.push("/login"); // Redirect to the login page
        })
        .catch(err => {
          console.log("ERROR");
        });
    else {
      this.setState({ message: "please indicate username, password and email" });
    }
  }

  render() {
    return (
      <div className="full-screen">
        <div className="Login">
          <h2>Signup</h2>
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={this.state.email}
                onChange={e => {
                  this.handleInputChange("email", e);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={this.state.name}
                onChange={e => {
                  this.handleInputChange("name", e);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="examplePassword"
                value={this.state.password}
                onChange={e => {
                  this.handleInputChange("password", e);
                }}
              />
            </FormGroup>
            <Button type="submit" onClick={e => this.handleClick(e)}>
              Signup
            </Button>
            {this.state.message && <FormText className="message">{this.state.message}</FormText>}
          </Form>
        </div>
      </div>
    );
  }
}

export default Signup;
