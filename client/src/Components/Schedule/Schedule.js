import React from "react";
import update from "react-addons-update";
import ScheduleSearch from "./ScheduleSearch";
import ScheduleTableTeacher from "./ScheduleTableTeacher";
import ScheduleTableAudience from "./ScheduleTableAudience";
import ScheduleTableGroup from "./ScheduleTableGroup";
import { useQuery } from "@apollo/client";
import { GET_INFO } from "./queries";

function ScheduleTables({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO,);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  const info = data.GetInfo;

  function SwitchTable({ filters }) {
    switch (filters.scheduleType) {
      case "teacher":
        return <ScheduleTableTeacher filters={filters} info={info}></ScheduleTableTeacher>
      case "audience":
        return <ScheduleTableAudience filters={filters} info={info}></ScheduleTableAudience>
      case "group":
        return <ScheduleTableGroup filters={filters} info={info}></ScheduleTableGroup>;
      default:
        return <ScheduleTableGroup filters={filters} info={info}></ScheduleTableGroup>;
    }
  }

  return (
    <div className="container-fluid w-100">
      <SwitchTable filters={filters}></SwitchTable>
    </div>
  );
}

class Schedule extends React.Component {
  state = {
    filters: {
      scheduleType: "group",
      id_specialty: null,
      id_teacher: null,
      id_group: null,
      id_audience: null,
      id_cathedra: null,
      semester: null,
    },
  };

  handleChangeFilters = (name, value) => {
    this.setState((PrevState) => ({
      filters: update(PrevState.filters, { $merge: { [name]: value } }),
    }));
  };

  render() {
    const { filters } = this.state;
    return (
      <>
        <ScheduleSearch
          filters={filters}
          handleChangeFilters={this.handleChangeFilters}
        ></ScheduleSearch>
        <ScheduleTables filters={filters}>
        </ScheduleTables>
      </>
    );
  }
}

export default Schedule;
