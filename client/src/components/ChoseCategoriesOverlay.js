/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Label, Input } from "reactstrap";
import CategoryButton from "./CategoryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api";

class ChoseCategoriesOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      categories: null,
      usedCategorieIds: props.usedCategorieIds
    };

    this.toggle = this.toggle.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleCreateNewCategorySubmit = this.handleCreateNewCategorySubmit.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleCategorySelection(categoryId) {
    const index = this.state.usedCategorieIds.indexOf(categoryId);
    if (index === -1)
      this.setState(oldState => ({
        usedCategorieIds: [...oldState.usedCategorieIds, categoryId]
      }));
    else
      this.setState(oldState => ({
        usedCategorieIds: oldState.usedCategorieIds.filter(id => id !== categoryId)
      }));
  }
  handleSaveClick() {
    this.toggle();
    this.props.handleParagraphUpdate(this.props.paragraphId, this.state.usedCategorieIds);
  }
  handleCreateNewCategorySubmit(name, color) {
    api.createCategory({ name, color }).then(res =>
      this.setState(prevState => ({
        categories: res.categories,
        usedCategorieIds: [...prevState.usedCategorieIds, res.categories[res.categories.length - 1]._id]
      }))
    );
  }

  componentDidMount() {
    api.getCategories().then(categories => {
      this.setState({ categories });
    });
  }

  render() {
    return (
      <div>
        <EditCategoriesButton handleClick={this.toggle} />
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Choose Categories for Paragraph</ModalHeader>
          <ModalBody>
            {this.state.categories &&
              this.state.categories.map(category => (
                <CategoryButton
                  size="lg"
                  key={category._id}
                  handleClick={_ => this.handleCategorySelection(category._id)}
                  isUsed={this.state.usedCategorieIds.includes(category._id)}
                  color={category.color}
                >
                  {category.name}
                </CategoryButton>
              ))}
          </ModalBody>

          <ModalFooter className="d-block">
            <CreateNewCategoryContainer handleSubmit={this.handleCreateNewCategorySubmit} />
            {/* <SaveCategoryButton /> */}
            {/* <Button href="#">Delete</Button> */}
          </ModalFooter>
          <ModalFooter>
            <SaveCategoryButton handleClick={this.handleSaveClick} />
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const EditCategoriesButton = props => {
  return (
    <button type="button" className={`${props.className} add-category-btn`} onClick={props.handleClick}>
      <FontAwesomeIcon icon="pen" size="xs" />
    </button>
  );
};

const SaveCategoryButton = props => {
  return (
    <button type="button" className={`${props.className} save-category-btn`} onClick={props.handleClick}>
      <FontAwesomeIcon icon="save" />
    </button>
  );
};

const SaveNewCategoryButton = props => {
  return (
    <button type="button" className={`${props.className} save-category-btn`} onClick={props.handleClick}>
      <FontAwesomeIcon icon="plus" />
    </button>
  );
};

class CreateNewCategoryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "#7FB7BE" };
    this.handleColorPick = this.handleColorPick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleColorPick(color) {
    this.setState({ color });
  }
  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }
  render() {
    return (
      <div className="row no-gutters">
        <div className="col-auto">
          <Label for="categoryName" hidden>
            Category Name
          </Label>
          <Input
            type="text"
            name="categoryName"
            id="categoryName"
            placeholder="Category Name"
            onChange={this.handleNameChange}
            value={this.state.name}
          />
        </div>
        <div className="col d-flex align-items-center ml-2">
          <ColorCheck color="#7FB7BE" handleClick={this.handleColorPick} currColor={this.state.color} />
          <ColorCheck color="#3F7EA8" handleClick={this.handleColorPick} currColor={this.state.color} />
          <ColorCheck color="#678D58" handleClick={this.handleColorPick} currColor={this.state.color} />
          <ColorCheck color="#D89D6A" handleClick={this.handleColorPick} currColor={this.state.color} />
          <ColorCheck color="#7D1538" handleClick={this.handleColorPick} currColor={this.state.color} />
        </div>
        <div className="col-auto">
          <SaveNewCategoryButton handleClick={_ => this.props.handleSubmit(this.state.name, this.state.color)} />
        </div>
      </div>
    );
  }
}

const ColorCheck = props => (
  <button
    className={`${props.className} color-checkbox ${props.currColor === props.color ? "checked" : "unchecked"}`}
    style={{ backgroundColor: props.color }}
    onClick={_ => props.handleClick(props.color)}
  />
);

export default ChoseCategoriesOverlay;
