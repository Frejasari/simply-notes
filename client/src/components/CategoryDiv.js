import React, { Component } from "react";
import CategoryButton from "./CategoryButton";

//#region Div for the categories
class CategoryDiv extends Component {
  render() {
    return (
      <div className={`${this.props.className} category-div `}>
        {this.props.categories.map((category, i) => (
          <CategoryButton key={category._id} color={category.color} size="sm">
            {category.name}
          </CategoryButton>
        ))}
      </div>
    );
  }
}
//#endregion

export default CategoryDiv;
