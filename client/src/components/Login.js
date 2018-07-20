import React, { Component } from "react";
import api from "../api";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
    if (this.state.email && this.state.password)
      api
        .login(this.state.email, this.state.password)
        .then(result => {
          console.log("SUCCESS!");
          this.props.history.push("/notebooks"); // Redirect to the home page
        })
        .catch(err => {
          this.setState({ message: "wrong password or wrong username, try again." });
          console.log("ERROR");
        });
    else {
      this.setState({ message: "please indicate username and password" });
    }
  }

  render() {
    return (
      <div className="full-screen">
        <div className="Login">
          <h2>Login</h2>
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
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={this.state.password}
                onChange={e => {
                  this.handleInputChange("password", e);
                }}
              />
            </FormGroup>
            <Button onClick={e => this.handleClick(e)}>Login</Button>
            {this.state.message && <FormText className="message">{this.state.message}</FormText>}
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
