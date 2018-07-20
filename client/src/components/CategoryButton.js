import React, { Component } from "react";
import { Link } from "react-router-dom";

class CategoryButton extends Component {
  render() {
    const selectedStyle = { backgroundColor: `${this.props.color}90`, borderColor: `transparent` };
    const unselectedStyle = { borderColor: `${this.props.color}90` };
    const unselectedStyleHover = { backgroundColor: `${this.props.color}40`, borderColor: `${this.props.color}90` };
    const selectedStyleHover = { backgroundColor: `${this.props.color}70`, borderColor: `${this.props.color}90` };
    if (this.props.isLink)
      return (
        <Link
          to={`/categories/${this.props.id}/paragraphs`}
          className="category-pill-container"
          onClick={this.props.handleClick}
        >
          <div
            className={`category-pill category-pill-${this.props.size} category-pill--off`}
            style={this.props.isUsed ? selectedStyle : unselectedStyle}
          >
            {this.props.children}
          </div>
          <div
            className={`category-pill category-pill-${this.props.size} category-pill--on`}
            style={this.props.isUsed ? unselectedStyle : selectedStyle}
          >
            {this.props.children}
          </div>
        </Link>
      );
    else
      return (
        <div className="category-pill-container" onClick={this.props.handleClick}>
          <div
            className={`category-pill category-pill-${this.props.size} category-pill--off`}
            style={this.props.isUsed ? selectedStyle : unselectedStyle}
          >
            {this.props.children}
          </div>
          <div
            className={`category-pill category-pill-${this.props.size} category-pill--on`}
            style={this.props.isUsed ? selectedStyleHover : unselectedStyleHover}
          >
            {this.props.children}
          </div>
        </div>
      );
  }
}

export default CategoryButton;
