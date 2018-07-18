import React, { Component } from "react";
import api from "../api";

//#region Content Editable Div -- with state
class ContentEditable extends Component {
  constructor(props) {
    super(props);
    this.state = { html: this.props.html, _id: this.props._id, hasChanged: false };
    this.textInputRef = null;

    //#region bind methods to this class
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleKeyUpEvents = this.handleKeyUpEvents.bind(this);
    this.handleKeyDownEvents = this.handleKeyDownEvents.bind(this);

    this.setTextInputRef = this.setTextInputRef.bind(this);
    this.focusTextInput = this.focusTextInput.bind(this);
    //#endregion
  }

  //#region handle focus change - create ref
  handleFocusLost() {
    if (this.state.hasChanged)
      api
        .editParagraph(this.state._id, { text: this.state.html })
        .then(_ => this.setState({ hasChanged: false }))
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
    if (this.textInput && this.mounted) {
      this.textInput.focus();
    }
  }
  //#endregion

  //#region Handle Keyevents
  handleKeyUpEvents(event) {
    switch (event.key) {
      case "Alt": {
        this.props.handleAltPress(false);
        break;
      }
      case "Enter": {
        if (!this.props.isAltPressed) break;
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
        this.props.handleAltPress(true);
      case "ArrowDown": {
        if (this.props.isAltPressed) {
          event.preventDefault();
          this.props.handleFocusChange("down");
        }
        break;
      }
      case "ArrowUp": {
        if (this.props.isAltPressed) {
          event.preventDefault();
          this.props.handleFocusChange("up");
        }
        break;
      }
    }
  }
  //#endregion

  //#region Lifecycle
  componentDidMount() {
    this.mounted = true;
    if (this.props.isCurrentFocus) this.focusTextInput(true);
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isCurrentFocus && nextProps.isCurrentFocus !== this.props.isCurrentFocus) this.focusTextInput();
    if (this.textInput && this.mounted) return this.textInput.innerHTML !== nextState.html;
    else if (this.mounted) return true;
  }
  render() {
    return (
      <div
        className={`editable-div ${this.props.className}`}
        onFocus={_ => this.props.handleFocusGain(this.props._id)}
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

export default ContentEditable;
