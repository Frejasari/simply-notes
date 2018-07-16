import React, { Component } from "react";
import api from "../api";

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
        <ul>
          {page._paragraphs.map(p => (
            <li key={p._id}>
              {p.text}
              <br />
              {p._categories.map((category, i) => (
                <b key={category._id}>{i === 0 ? category.name : `, ${category.name}`}</b>
              ))}
              <br />
              <br />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Page;
