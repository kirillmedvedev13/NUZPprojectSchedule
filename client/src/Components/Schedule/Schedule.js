import React from "react";
import update from "react-addons-update";
import ScheduleSearch from "./ScheduleSearch";
import ScheduleTableTeacher from "./ScheduleTableTeacher";
import ScheduleTableAudience from "./ScheduleTableAudience";
import ScheduleTableGroup from "./ScheduleTableGroup";
import { GET_INFO } from "./queries";
import { useQuery } from "@apollo/client";

function GetInfo({ handleChangeInfo, info }) {
  const { loading, error, data } = useQuery(GET_INFO, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  if (info !== data.GetInfo)
    handleChangeInfo(data.GetInfo);
  return <></>
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
    info: null,
  };

  handleChangeFilters = (name, value) => {
    this.setState((PrevState) => ({
      filters: update(PrevState.filters, { $merge: { [name]: value } }),
    }));
  };

  handleChangeInfo = (info) => {
    this.setState({ info });
  }

  render() {
    function SwitchTable({ filters, info }) {
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
    const { filters, info } = this.state;
    return (
      <>
        <GetInfo handleChangeInfo={this.handleChangeInfo} info={info}></GetInfo>
        <ScheduleSearch
          filters={filters}
          handleChangeFilters={this.handleChangeFilters}
        ></ScheduleSearch>

        <div className="container-fluid w-100">
          <SwitchTable filters={filters} info={info}></SwitchTable>
        </div>
      </>
    );
  }
}

export default Schedule;
