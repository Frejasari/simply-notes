import React, { Component } from "react";
import CategoryButton from "./CategoryButton";
import ChoseCategoriesOverlay from "./ChoseCategoriesOverlay";

//#region Div for the categories
class CategoryDiv extends Component {
  render() {
    return (
      <div className={`${this.props.className} category-div `}>
        {this.props.categories.map((category, i) => (
          <CategoryButton key={category._id} id={category._id} isLink={true} color={category.color} size="sm">
            {category.name}
          </CategoryButton>
        ))}
        <div>
          <ChoseCategoriesOverlay
            paragraphId={this.props.paragraphId}
            handleParagraphUpdate={this.props.handleParagraphUpdate}
            usedCategorieIds={this.props.categories.map(category => category._id)}
          />
        </div>
      </div>
    );
  }
}
//#endregion

export default CategoryDiv;
