import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SaveButton.css";

const SaveButton = props => {
  return (
    <button type="button" className={`${props.className} save-btn-lg`} onClick={props.handleClick}>
      <FontAwesomeIcon icon="save" />
    </button>
  );
};

export default SaveButton;
