import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_ALL_SCHEDULE_GROUPS, GET_INFO } from "./queries";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";

function getDescription(schedule) {
  const desciption = `
  ${schedule.assigned_group.class.type_class.name} ауд.${
    schedule.audience.name
  } ${
    schedule.assigned_group.class.assigned_discipline.discipline.name
  } ${schedule.assigned_group.class.assigned_teachers.map(({ teacher }) => {
    return ` ${teacher.surname}`;
  })}
`;
  return desciption;
}

function DataTable({ filters, info }) {
  const { id_cathedra, id_group, id_specialty, semester } = filters;
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE_GROUPS, {
    variables: {
      id_specialty,
      id_group,
      id_cathedra,
      semester,
    },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;
  let curGroup = null;
  let MapGroup = new Map();
  let temp = [];
  if (!data.GetAllScheduleGroups.length) return <tbody></tbody>;
  data.GetAllScheduleGroups.forEach((schedule) => {
    if (schedule.assigned_group.group !== curGroup && !curGroup) {
      curGroup = schedule.assigned_group.group;
    }
    if (schedule.assigned_group.group !== curGroup && curGroup) {
      MapGroup.set(curGroup, temp);
      curGroup = schedule.assigned_group.group;
      temp = [];
    }
    temp.push(schedule);
  });
  MapGroup.set(curGroup, temp);
  return TableBody(MapGroup, info, getDescription);
}

function TableHead({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <thead>
        <tr>
          <th>Група</th>
          <th>#</th>
          {[...Array(data.GetInfo.max_day)].map((i, index) => {
            return <th key={DaysWeek[index]}>{DaysWeek[index]}</th>;
          })}
        </tr>
      </thead>
      <DataTable filters={filters} info={data.GetInfo}></DataTable>
    </>
  );
}

class ScheduleTableGroup extends React.Component {
  render() {
    const { filters, info } = this.props;
    return (
      <Table bordered>
        <TableHead filters={filters}></TableHead>
      </Table>
    );
  }
}
export default ScheduleTableGroup;
