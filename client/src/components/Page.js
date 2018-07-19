import React, { Component } from "react";
import Paragraph from "./Paragraph";
import api from "../api";
import "./Page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: null,
      currentFocus: null,
      isAltPressed: false
    };
    //#region bind methods to this class
    this.deleteParagraph = this.deleteParagraph.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
    this.handleAltPress = this.handleAltPress.bind(this);
    this.handleParagraphUpdate = this.handleParagraphUpdate.bind(this);
    //#endregion
  }
  handleParagraphUpdate(paragraphId, newParagraphs) {
    console.log("HANDLE PARAGRAPH UPDATE", paragraphId, newParagraphs);
    api.editParagraph(paragraphId, { _categories: newParagraphs }).then(res => {
      this.setState({ page: res.page });
    });
  }
  //#region handle focus changes of paragraphs when creating/ deleting or switching between them
  handleAltPress(isPressed) {
    if (isPressed !== this.state.isAltPressed)
      this.setState(prevState => ({
        isAltPressed: !prevState.isAltPressed
      }));
  }
  createNewParagraph(position) {
    api
      .createParagraph(this.state.page._id, { text: " ", position })
      .then(res => {
        this.setState({ page: res.page, currentFocus: res.page._paragraphs[position]._id });
      })
      .catch(err => console.log(err));
  }
  deleteParagraph(paragraphId) {
    api.deleteParagraph(this.state.page._id, paragraphId).then(res => {
      this.setState(state => {
        const paragraphArr = state.page._paragraphs;
        const indexOfNewParagraph = paragraphArr.findIndex(p => p._id === paragraphId) - 1;
        const paragraphBeforeDeletedOne = paragraphArr[indexOfNewParagraph >= 0 ? indexOfNewParagraph : 1]._id;
        return { page: res.page, currentFocus: paragraphBeforeDeletedOne };
      });
    });
  }
  handleFocusChange(direction) {
    this.setState(prevState => {
      const paragraphArr = prevState.page._paragraphs;
      const indexOfCurrFocusParagraph = paragraphArr.findIndex(p => p._id === prevState.currentFocus);
      let newParagraph = null;
      if (direction === "up")
        newParagraph = paragraphArr[indexOfCurrFocusParagraph > 0 ? indexOfCurrFocusParagraph - 1 : 0];
      if (direction === "down")
        newParagraph =
          paragraphArr[
            indexOfCurrFocusParagraph < paragraphArr.length - 1
              ? indexOfCurrFocusParagraph + 1
              : paragraphArr.length - 1
          ];
      return { currentFocus: newParagraph._id };
    });
  }
  setFocus(id) {
    if (this.state.currentFocus !== id) this.setState({ currentFocus: id });
  }
  //#endregion

  getPageFromApi() {
    api
      .getPage(this.props.match.params.notebookId, this.props.match.params.pageId)
      .then(page => {
        this.setState({
          page: page,
          currentFocus: page._paragraphs[0]._id
        });
      })
      .catch(err => console.log(err));
  }

  //#region lifecycle
  componentDidMount() {
    this.getPageFromApi();
  }
  componentDidUpdate() {
    if (this.props.match.params.pageId !== this.state.page._id) this.getPageFromApi();
  }
  render() {
    const page = this.state.page;
    if (!page) return <div>loading....</div>;
    return (
      <div className="Notebooks">
        <h2>{page.title}</h2>
        <p>{page.description}</p>
        <AddButton createNewParagraph={_ => this.createNewParagraph(0)} />
        {page._paragraphs.map((p, i) => (
          <div key={p._id}>
            <Paragraph
              paragraph={p}
              index={i}
              isAltPressed={this.state.isAltPressed}
              isCurrentFocus={this.state.currentFocus === p._id}
              createNewParagraph={_ => this.createNewParagraph(i + 1)}
              deleteParagraph={this.deleteParagraph}
              handleFocusGain={this.setFocus}
              handleFocusChange={this.handleFocusChange}
              handleAltPress={this.handleAltPress}
              handleParagraphUpdate={this.handleParagraphUpdate}
            />
          </div>
        ))}
      </div>
    );
  }
  //#endregion
}

const AddButton = props => {
  return (
    <div className="row">
      <div className="col text-right">
        <button type="button" className="add-first-btn" onClick={props.createNewParagraph}>
          <FontAwesomeIcon icon="plus" size="xs" />
        </button>
      </div>
    </div>
  );
};

export default Page;
