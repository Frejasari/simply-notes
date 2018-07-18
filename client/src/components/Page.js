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
      currentFocus: null
    };
    this.deleteParagraph = this.deleteParagraph.bind(this);
    this.setFocus = this.setFocus.bind(this);
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
  setFocus(id) {
    if (this.state.currentFocus !== id) this.setState({ currentFocus: id });
  }
  componentDidMount() {
    api
      .getPage(this.props.match.params.pageId)
      .then(page => {
        this.setState({
          page: page,
          currentFocus: page._paragraphs[0]._id
        });
      })
      .catch(err => console.log(err));
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
              isCurrentFocus={this.state.currentFocus === p._id}
              createNewParagraph={_ => this.createNewParagraph(i + 1)}
              deleteParagraph={this.deleteParagraph}
              handleFocusChange={this.setFocus}
            />
          </div>
        ))}
      </div>
    );
  }
}

const AddButton = props => {
  return (
    <div className="row">
      <div className="col text-right pr-0">
        <button type="button" className="add-first-btn" onClick={props.createNewParagraph}>
          <FontAwesomeIcon icon="plus" size="xs" />
        </button>
      </div>
    </div>
  );
};

export default Page;
