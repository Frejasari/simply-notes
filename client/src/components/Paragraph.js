import React, { Component } from "react";
import ContentEditable from "./ContentEditable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//#region Div for the categories
class CategoryDiv extends Component {
  render() {
    return (
      <div className={`${this.props.className} category-div`}>
        {this.props.categories.map((category, i) => (
          <b key={category._id}> {i === 0 ? category.name : `, ${category.name}`}</b>
        ))}
      </div>
    );
  }
}
//#endregion

//#region Paragraph : Content Editable Div + Category Div
class Paragraph extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const paragraph = this.props.paragraph;
    if (!paragraph) return <div>... loading</div>;
    return (
      <div className={"row"}>
        <CategoryDiv
          className={`col-pixel-width-100 ${this.props.index === 0 ? "first-category-div" : ""}`}
          categories={paragraph._categories}
        />
        <ContentEditable
          isAltPressed={this.props.isAltPressed}
          handleAltPress={this.props.handleAltPress}
          isCurrentFocus={this.props.isCurrentFocus}
          className={`col`}
          html={paragraph.text}
          _id={paragraph._id}
          createNewParagraph={this.props.createNewParagraph}
          deleteParagraph={this.props.deleteParagraph}
          handleFocusGain={this.props.handleFocusGain}
          handleFocusChange={this.props.handleFocusChange}
        />
        <div className="position-relative">
          <button type="button" className="add-btn" onClick={this.props.createNewParagraph}>
            <FontAwesomeIcon icon="plus" size="xs" />
          </button>
        </div>
      </div>
    );
  }
}
//#endregion

export default Paragraph;
