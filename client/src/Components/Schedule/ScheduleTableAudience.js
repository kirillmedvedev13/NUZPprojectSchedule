import { useQuery } from "@apollo/client";
import React from "react";
import { Table, Button } from "react-bootstrap";
import { GET_ALL_SCHEDULE_AUDIENCES } from "./queries";
import { DaysWeek } from "./DaysWeek";
import SplitPairs from "./SplitPairs";
import TableBody from "./TableBody";
import GetGroupsName from "./GetGroupsName";

import ButtonGetTableExcel from "./ButtonGetTableExcel";

function getDescription(schedule) {
  let teachers = " ";
  schedule.assigned_group.class.assigned_teachers.forEach((teacher) => {
    teachers +=
      teacher.teacher.surname +
      " " +
      teacher.teacher.name +
      " " +
      teacher.teacher.patronymic;
  });
  const desciption = `
   ${schedule.assigned_group.class.type_class.name} ${
    schedule.assigned_group.class.assigned_discipline.discipline.name
  } 
   ${GetGroupsName(schedule.assigned_group.group.name)} 
   ${teachers}
 
  `;
  return desciption;
}

function DataTable({ filters, info }) {
  const { id_audience, id_cathedra } = filters;
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE_AUDIENCES, {
    variables: {
      id_audience,
      id_cathedra,
    },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  if (!data.GetAllScheduleAudiences.length) return <tbody></tbody>;
  let MapAudience = new Map();

  for (const audience of data.GetAllScheduleAudiences) {
    MapAudience.set(
      { id: audience.id, name: audience.name },
      SplitPairs(audience.schedules)
    );
  }
  return TableBody(MapAudience, info, getDescription);
}

function TableHead({ info }) {
  return (
    <thead>
      <tr>
        <th>Аудиторія</th>
        <th>#</th>
        {[...Array(info.max_day)].map((i, index) => {
          return <th key={DaysWeek[index]}>{DaysWeek[index]}</th>;
        })}
      </tr>
    </thead>
  );
}

class ScheduleTableAudience extends React.Component {
  constructor(props) {
    super(props);
    this.refTable = React.createRef();
    this.state = {
      workBook: null,
    };
    this.setWorkBook = this.setWorkBook.bind(this);
  }

  setWorkBook(workBook) {
    this.setState((PrevState) => ({
      workBook,
    }));
  }
  render() {
    const { filters, info } = this.props;

    return (
      <>
        <ButtonGetTableExcel
          refTable={this.refTable}
          nameTable="scheduleTableAudience"
          wb={this.state.workBook}
          setWorkBook={this.setWorkBook}
        ></ButtonGetTableExcel>
        <Table
          striped
          ref={this.refTable}
          bordered
          className="border border-dark"
        >
          <TableHead info={info}></TableHead>
          <DataTable filters={filters} info={info}></DataTable>
        </Table>
      </>
    );
  }
}
export default ScheduleTableAudience;
