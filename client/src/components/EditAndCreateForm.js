import React from "react";
import { Col, Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

export default class EditAndCreateForm extends React.Component {
  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input type="text" name="title" id="title" value={this.props.title} onChange={this.props.handleTitleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            style={{ resize: "none" }}
            value={this.props.description}
            onChange={this.props.handleDescriptionChange}
          />
        </FormGroup>
      </Form>
    );
  }
}
