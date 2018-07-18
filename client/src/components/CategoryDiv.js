import React, { Component } from "react";

//#region Div for the categories
class CategoryDiv extends Component {
  render() {
    return (
      <div className={`${this.props.className} category-div`}>
        {this.props.categories.map((category, i) => (
          <CategoryButton key={category._id} color={category.color}>
            {category.name}
          </CategoryButton>
        ))}
      </div>
    );
  }
}
//#endregion

const CategoryButton = props => {
  return (
    <div className="category-pill-container">
      <div className="category-pill category-pill--off" style={{ borderColor: `${props.color}90` }}>
        {props.children}
      </div>
      <div
        className="category-pill category-pill--on"
        style={{ backgroundColor: `${props.color}90`, borderColor: `transparent` }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default CategoryDiv;
