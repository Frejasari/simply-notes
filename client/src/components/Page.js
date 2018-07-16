import React, { Component } from "react";
import api from "../api";
import "./Page.css";

const DEFAULT_HEIGHT = 20;

class Paragraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: DEFAULT_HEIGHT,
      text: this.props.text
    };
    this.mounted = false;
    this.ghost = null;
    this.handleTextChange = this.handleTextChange.bind(this);
    this.setFilledTextareaHeight = this.setFilledTextareaHeight.bind(this);
  }

  setFilledTextareaHeight() {
    console.log("----- KU HEIGHT");
    if (this.mounted) {
      const newHeight = this.ghost.clientHeight + DEFAULT_HEIGHT;
      if (newHeight !== this.state.height)
        this.setState({
          height: newHeight
        });
    }
  }

  handleTextChange(event) {
    console.log("----- HVC HEIGHT");
    const text = event.target.value;
    if (this.mounted) {
      this.setState({ text: text });
    }
  }

  getExpandableField() {
    // console.log("GET EXPANDABLE FIELD");
    const { height, text } = this.state;
    return (
      <textarea
        className="textarea"
        name="textarea"
        id="textarea"
        autoFocus={true}
        defaultValue={text}
        style={{
          height
        }}
        onChange={this.handleTextChange}
        onKeyUp={this.setFilledTextareaHeight}
      />
    );
  }

  getGhostField() {
    // console.log("GET GHOST FIELD");
    return (
      <div className="textarea textarea--ghost" ref={c => (this.ghost = c)} aria-hidden="true">
        {this.state.text}
      </div>
    );
  }

  componentDidMount() {
    console.log("DID MOUNT");
    this.mounted = true;
    this.setFilledTextareaHeight();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    console.log("RENDER");

    return (
      <div className="paragraph-container">
        {this.getGhostField()}
        {this.getExpandableField()}
      </div>
    );
  }
}

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
        {page._paragraphs.map(p => (
          <div key={p._id}>
            <Paragraph text={p.text} />
          </div>
        ))}
      </div>
    );
  }
}

export default Page;
