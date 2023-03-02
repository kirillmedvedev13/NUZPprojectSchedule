import React from "react";
import NaviBarAdmin from "../NaviBarAdmin.js";
import DeleteData from "./DeleteData.js";
import GetSchedule from "./GetSchedule.js";

export default class ManagementData extends React.Component {
  render() {
    return (
      <>
        <NaviBarAdmin></NaviBarAdmin>
        <div>
          <DeleteData></DeleteData>
          <GetSchedule></GetSchedule>
        </div>
      </>
    );
  }
}
