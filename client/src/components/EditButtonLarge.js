import React from "react";
import "./EditButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditButton = props => {
  return (
    <button type="button" className={`${props.className} edit-btn`} onClick={props.handleClick}>
      <FontAwesomeIcon icon="pen" size="lg" />
    </button>
  );
};

export default EditButton;
