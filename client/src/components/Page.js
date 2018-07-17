import React, { Component } from "react";
import api from "../api";
import Paragraph from "./Paragraph";

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
  createNewParagraph(i) {
    api
      .createParagraph(this.state.page._id, { text: " ", position: i + 1 })
      .then(res => {
        this.setState({ page: res.page });
      })
      .catch(err => console.log(err));
  }
  deleteParagraph(paragraphId) {
    api.deleteParagraph(this.state.page._id, paragraphId).then(res => {
      this.setState({ page: res.page });
    });
  }
  setFocus(id) {
    this.setState({ currentFocus: id });
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
        {page._paragraphs.map((p, i) => (
          <div key={p._id}>
            <Paragraph
              paragraph={p}
              index={i}
              isCurrentFocus={this.state.currentFocus === p._id}
              createNewParagraph={_ => this.createNewParagraph(i)}
              deleteParagraph={this.deleteParagraph}
              handleFocusChange={this.setFocus}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Page;
