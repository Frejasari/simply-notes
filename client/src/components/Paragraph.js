import React, { Component } from "react";
import "./Page.css";
var ReactDOM = require("react-dom");

//#region Content Editable Div -- with state
class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.state = { html: this.props.html, _id: this.props._id };
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(event) {
    event.preventDefault();
    this.setState({ html: event.target.innerHTML });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return ReactDOM.findDOMNode(this).innerHTML !== nextState.html;
  }
  render() {
    return (
      <div
        className={`editable-div ${this.props.className}`}
        onInput={this.handleTextChange}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
      />
    );
  }
}
//#endregion

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
  render() {
    return (
      <div className={"row"}>
        <CategoryDiv
          className={`col-pixel-width-100 ${this.props.index === 0 ? "first-category-div" : ""}`}
          categories={this.props.paragraph._categories}
        />
        <ContentEditable className={`col`} html={this.props.paragraph.text} />
      </div>
    );
  }
}
//#endregion

export default Paragraph;
