import React, { Component } from "react";
import { Collapse, Button, Card, CardText, CardBody, CardLink } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormOverlay from "./FormOverlay";

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <div className={`mb-1 ${this.props.className} row`}>
        <div className="col">
          <Card className={`list-card ${this.props.isSelected ? "is-selected" : "is-unselected"}`}>
            <CardBody className="list-header">
              <div className="row no-gutters">
                <div className="col">
                  <Link to={this.props.link} onClick={this.props.onClick}>
                    {this.props.data.title}
                  </Link>
                </div>
                <div className="col-auto d-flex align-items-center ml-1">
                  <Button className="show-info-btn" onClick={this.toggle}>
                    <FontAwesomeIcon onClick={this.toggle} icon="angle-down" />
                  </Button>
                </div>
              </div>
              <Collapse isOpen={this.state.collapse}>
                <CardText className="list-description">{this.props.data.description}</CardText>
                <FormOverlay
                  headline={this.props.headline}
                  handleSaveClick={this.props.handleSaveClick}
                  title={this.props.data.title}
                  description={this.props.data.description}
                />
                {/* <Button href="#">Delete</Button> */}
              </Collapse>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

export default ListItem;
