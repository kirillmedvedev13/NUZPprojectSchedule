import { GET_ALL_SCHEDULE_TEACHERS, GET_INFO } from "./queries";
import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";
import SplitPairs from "./SplitPairs";
import GetGroupsName from "./GetGroupsName";
import ButtonGetTableExcel from "./ButtonGetTableExcel";

function getDescription(schedule) {
  const desciption = `
  ${schedule.assigned_group.class.type_class.name}
  ауд.${schedule.audience.name} 
  ${schedule.assigned_group.class.assigned_discipline.discipline.name} 
  ${GetGroupsName(schedule.assigned_group.group.name)}
  `;
  return desciption;
}

function GetTeachers(schedules) {
  let teachers = new Set();
  schedules.forEach((schedule) => {
    for (
      let i = 0;
      i < schedule.assigned_group.class.assigned_teachers.length;
      i++
    ) {
      teachers.add(schedule.assigned_group.class.assigned_teachers[i].teacher);
    }
  });
  return teachers;
}

function DataTable({ filters, info }) {
  const { id_cathedra, id_teacher } = filters;
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE_TEACHERS, {
    variables: {
      id_cathedra,
      id_teacher,
    },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  if (!data.GetAllScheduleTeachers.length) return <tbody></tbody>;
  let MapTeacher = new Map();
  let teachers = GetTeachers(data.GetAllScheduleTeachers);
  for (const teacher of teachers) {
    let classes = data.GetAllScheduleTeachers.filter((schedule) => {
      let temp = schedule.assigned_group.class.assigned_teachers.find(
        (teach) => +teach.teacher.id === +teacher.id
      );
      if (temp) return true;
      else return false;
    });

    MapTeacher.set(
      {
        id: teacher.id,
        name: `${teacher.surname} ${teacher.name} ${teacher.patronymic}`,
      },
      classes.length === 0 ? [] : SplitPairs(classes)
    );
  }

  return TableBody(MapTeacher, info, getDescription);
}

function TableHead({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO);
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <thead>
        <tr>
          <th>Викладач</th>
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
class ScheduleTableTeacher extends React.Component {
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
    const { filters } = this.props;
    return (
      <>
        <ButtonGetTableExcel
          refTable={this.refTable}
          nameTable="scheduleTableTeacher"
          wb={this.state.workBook}
          setWorkBook={this.setWorkBook}
        ></ButtonGetTableExcel>
        <Table
          striped
          ref={this.refTable}
          bordered
          className="border border-dark"
        >
          <TableHead filters={filters}></TableHead>
        </Table>
      </>
    );
  }
}
export default ScheduleTableTeacher;
