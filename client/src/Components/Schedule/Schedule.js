import React, { useRef } from "react";
import update from "react-addons-update";
import { Button } from "react-bootstrap";
import ScheduleSearch from "./ScheduleSearch";
import ScheduleTableTeacher from "./ScheduleTableTeacher";
import ScheduleTableAudience from "./ScheduleTableAudience";
import ScheduleTableGroup from "./ScheduleTableGroup";

class Schedule extends React.Component {
  state = {
    filters: {
      scheduleType: "group",
      id_specialty: null,
      id_teacher: null,
      id_group: null,
      id_audience: null,
      id_cathedra: null,
    },
  };

  handleChangeFilters = (name, value) => {
    this.setState((PrevState) => ({
      filters: update(PrevState.filters, { $merge: { [name]: value } }),
    }));
  };

  render() {
    function SwitchTable({ filters }) {
      switch (filters.scheduleType) {
        case "teacher":
          return (
            <ScheduleTableTeacher filters={filters}></ScheduleTableTeacher>
          );
        case "audience":
          return (
            <ScheduleTableAudience filters={filters}></ScheduleTableAudience>
          );
        default:
          return <ScheduleTableGroup filters={filters}></ScheduleTableGroup>;
      }
    }
    const { filters } = this.state;
    return (
      <>
        <ScheduleSearch
          filters={filters}
          handleChangeFilters={this.handleChangeFilters}
        ></ScheduleSearch>

        <div className="container-fluid w-100">
          <SwitchTable filters={filters}></SwitchTable>
        </div>
      </>
    );
  }
}

export default Schedule;
