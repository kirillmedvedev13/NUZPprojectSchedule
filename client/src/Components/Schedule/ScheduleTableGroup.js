import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { GET_ALL_SCHEDULE_GROUPS } from "./queries";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";
import ButtonGetTableExcel from "./ButtonGetTableExcel";

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

function DataTable({ filters, info, aoa, handleSetAOA }) {
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
      curGroup = JSON.parse(JSON.stringify(curGroup));
      curGroup.name =
        curGroup.specialty.cathedra.short_name + "-" + curGroup.name;
      MapGroup.set(curGroup, temp);
      curGroup = schedule.assigned_group.group;
      temp = [];
    }
    temp.push(schedule);
  });
  curGroup = JSON.parse(JSON.stringify(curGroup));
  curGroup.name = curGroup.specialty.cathedra.short_name + "-" + curGroup.name;
  MapGroup.set(curGroup, temp);
  return TableBody(MapGroup, info, getDescription, aoa, handleSetAOA);
}

function TableHead({ info }) {
  return (
    <thead>
      <tr>
        <th>Група</th>
        <th>#</th>
        {[...Array(info.max_day)].map((i, index) => {
          return <th key={DaysWeek[index]}>{DaysWeek[index]}</th>;
        })}
      </tr>
    </thead>
  );
}

class ScheduleTableGroup extends React.Component {
  constructor(props) {
    super(props);
    this.refTable = React.createRef();
  }

  render() {
    const { filters, info } = this.props;
    return (
      <>
        <ButtonGetTableExcel
          refTable={this.refTable}
          nameTable="scheduleTableGroup"
        ></ButtonGetTableExcel>
        <Table ref={this.refTable} bordered className="border border-dark">
          <TableHead info={info}></TableHead>
          <DataTable filters={filters} info={info}></DataTable>
        </Table>
      </>
    );
  }
}
export default ScheduleTableGroup;
