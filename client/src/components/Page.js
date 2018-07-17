import React, { Component } from "react";
import api from "../api";
import Paragraph from "./Paragraph";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: null
    };
    this.handleEditClick = this.handleEditClick.bind();
  }
  handleEditClick(e) {
    console.log("HANDLE EDIT CLICK", e.target.id);
  }
  componentDidMount() {
    console.log("PAGEID", this.props.match.params.pageId);
    api
      .getPage(this.props.match.params.pageId)
      .then(page => {
        this.setState({
          page: page
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    if (!this.state.page) return <div>loading....</div>;
    const page = this.state.page;
    return (
      <div className="Notebooks">
        <h2>{page.title}</h2>
        <p>{page.description}</p>
        {page._paragraphs.map((p, i) => (
          <div key={p._id}>
            <Paragraph paragraph={p} index={i} />
          </div>
        ))}
      </div>
    );
  }
}

export default Page;
