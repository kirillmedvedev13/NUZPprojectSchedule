import React from "react";
import DeleteData from "./DeleteData.js";

export default class ManagementData extends React.Component {
  componentDidMount() {
    document.title = this.props.title;
  }
  render() {
    return (
      <>
        <div className="col-md-6 offset-md-3">
          <DeleteData></DeleteData>
        </div>
      </>
    );
  }
}
