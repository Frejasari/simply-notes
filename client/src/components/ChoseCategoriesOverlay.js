/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import CategoryButton from "./CategoryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api";

class ChoseCategoriesOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      categories: null,
      usedCategorieIds: props.usedCategorieIds
    };

    this.toggle = this.toggle.bind(this);
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

  componentDidMount() {
    api.getCategories().then(categories => {
      this.setState({ categories });
    });
  }

  render() {
    return (
      <div>
        <AddCategoryButton handleClick={this.toggle} />
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
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>
              Save
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const AddCategoryButton = props => {
  return (
    <button type="button" className={`${props.className} add-category-btn`} onClick={props.handleClick}>
      <FontAwesomeIcon icon="plus" size="xs" />
    </button>
  );
};

export default ChoseCategoriesOverlay;
