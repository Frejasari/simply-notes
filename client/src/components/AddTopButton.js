import React from "react";
import "./Page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AddTopButton.css";

const AddButton = props => {
  return (
    <div className="row">
      <div className="col text-right">
        <button type="button" className="add-first-btn" onClick={props.handleAddClick}>
          <FontAwesomeIcon icon="plus" size="xs" /> <span className="message-text">{props.message}</span>
        </button>
      </div>
    </div>
  );
};

export default AddButton;
