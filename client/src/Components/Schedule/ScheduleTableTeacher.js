import { GET_ALL_SCHEDULE_TEACHERS, GET_INFO } from "./queries";
import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";
import SplitPairs from "./SplitPairs";

function getDescription(schedule) {
  const desciption = `
   ауд.${schedule.audience.name} ${schedule.assigned_group.group.name}
  ${schedule.assigned_group.class.type_class.name} ${schedule.assigned_group.class.assigned_discipline.discipline.name} 
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
  const { id_cathedra, id_group, id_specialty, semester } = filters;
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE_TEACHERS, {
    variables: {
      id_specialty,
      id_group,
      id_cathedra,
      semester,
    },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  if (!data.GetAllScheduleTeachers.length) return <tbody></tbody>;
  let MapTeacher = new Map();
  let teachers = GetTeachers(data.GetAllScheduleTeachers);
  for (const teacher of teachers) {
    let temp = [];
    data.GetAllScheduleTeachers.forEach((schedule) => {
      for (
        let i = 0;
        i < schedule.assigned_group.class.assigned_teachers.length;
        i++
      ) {
        if (
          schedule.assigned_group.class.assigned_teachers[i].teacher.id ===
          teacher.id
        )
          temp.push(schedule);
      }
    });

    MapTeacher.set(
      {
        id: teacher.id,
        name: `${teacher.surname} ${teacher.name} ${teacher.patronymic}`,
      },
      SplitPairs(temp)
    );
  }

  return TableBody(MapTeacher, info, getDescription);
}

function TableHead({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO, {});
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
  render() {
    const { filters, info } = this.props;
    return (
      <Table bordered>
        <TableHead filters={filters}></TableHead>
      </Table>
    );
  }
}
export default ScheduleTableTeacher;
