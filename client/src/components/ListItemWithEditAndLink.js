import React from "react";
import { Link } from "react-router-dom";

const ListItem = props => {
  return (
    <li>
      <Link to={props.link}>{props.data.title}</Link>
      <p>{props.data.description}</p>
      <button onClick={props.handleEditClick} id={props.data._id}>
        Edit
      </button>
    </li>
  );
};

export default ListItem;
