import React, { Component } from "react";

const CategoryButton = props => {
  const selectedStyle = { backgroundColor: `${props.color}90`, borderColor: `transparent` };
  const unselectedStyle = { borderColor: `${props.color}90` };
  return (
    <div className="category-pill-container" onClick={props.handleClick}>
      <div
        className={`category-pill category-pill-${props.size} category-pill--off`}
        style={props.isUsed ? selectedStyle : unselectedStyle}
      >
        {props.children}
      </div>
      <div
        className={`category-pill category-pill-${props.size} category-pill--on`}
        style={props.isUsed ? unselectedStyle : selectedStyle}
      >
        {props.children}
      </div>
    </div>
  );
};

export default CategoryButton;
