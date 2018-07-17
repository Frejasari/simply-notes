import React, { Component } from "react";
import "./Page.css";
import api from "../api";

//#region Content Editable Div -- with state
class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.state = { html: this.props.html, _id: this.props._id, hasChanged: false, isAltPressed: false };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleKeyUpEvents = this.handleKeyUpEvents.bind(this);
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this);

    this.textInputRef = null;
    this.setTextInputRef = this.setTextInputRef.bind(this);
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  handleFocusLost(event) {
    if (this.state.hasChanged)
      api
        .editParagraph(this.state._id, { text: this.state.html })
        .then(page => this.setState({ hasChanged: false }))
        .catch(err => console.log(err));
  }
  handleTextChange(event) {
    event.preventDefault();
    this.setState({ html: event.target.innerHTML, hasChanged: true });
  }

  setTextInputRef(element) {
    this.textInput = element;
  }
  focusTextInput() {
    if (this.textInput && this.props.isCurrentFocus) this.textInput.focus();
  }

  //#region Handle Keyevents
  handleKeyUpEvents(event) {
    switch (event.key) {
      case "Alt": {
        this.setState({ isAltPressed: false });
        break;
      }
      case "Enter": {
        if (!this.state.isAltPressed) break;
        event.preventDefault();
        this.props.createNewParagraph();
      }
      case "Backspace": {
        if (!this.state.html) {
          event.preventDefault();
          this.props.deleteParagraph(this.state._id);
        }
      }
    }
  }
  handleKeyDownEvents(event) {
    switch (event.key) {
      case "Alt":
        this.setState({ isAltPressed: true });
    }
  }
  //#endregion

  //#region Lifecycle
  componentDidMount() {
    this.focusTextInput();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.textInput) return this.textInput.innerHTML !== nextState.html;
    else return true;
  }
  render() {
    return (
      <div
        className={`editable-div ${this.props.className}`}
        onInput={this.handleTextChange}
        onBlur={this.handleFocusLost}
        contentEditable={true}
        onKeyUp={this.handleKeyUpEvents}
        onKeyDown={this.handleKeyDownEvents}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
        ref={this.setTextInputRef}
      />
    );
  }
  //#endregion
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
    const paragraph = this.props.paragraph;
    if (!paragraph) return <div>... loading</div>;
    // console.log("RENDER PARAGRAPH", this.props.paragraph._id);
    return (
      <div className={"row"}>
        {this.props.index}
        <CategoryDiv
          className={`col-pixel-width-100 ${this.props.index === 0 ? "first-category-div" : ""}`}
          categories={paragraph._categories}
        />
        <ContentEditable
          isCurrentFocus={this.props.isCurrentFocus}
          className={`col`}
          html={paragraph.text}
          _id={paragraph._id}
          createNewParagraph={this.props.createNewParagraph}
          deleteParagraph={this.props.deleteParagraph}
        />
      </div>
    );
  }
}
//#endregion

export default Paragraph;
