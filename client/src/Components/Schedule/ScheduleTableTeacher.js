import { GET_ALL_SCHEDULE_TEACHERS, GET_INFO } from "./queries";
import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";
import GetGroupsName from "./GetGroupsName";
import SortSchedule from "./SortSchedule";
import ButtonGetDataFile from "./ButtonGetDataFile";

function GetSchedules(schedule) {
  let arrSched = [];
  for (let clas of schedule) {
    for (let pair of clas.class.schedules) {
      arrSched.push({
        id: pair.id,
        number_pair: pair.number_pair,
        day_week: pair.day_week,
        pair_type: pair.pair_type,
        audience: pair.audience,
        class: {
          type_class: clas.class.type_class,
          assigned_discipline: clas.class.assigned_discipline,
          assigned_groups: clas.class.assigned_groups,
        },
      });
    }
  }
  SortSchedule(arrSched);
  return arrSched;
}
function getDescription(schedule) {
  const desciption = `
  ${schedule.class.type_class.name}
  ауд.${schedule.audience.name} 
  ${schedule.class.assigned_discipline.discipline.name} 
  ${GetGroupsName(schedule.class.assigned_groups)}
  `;
  return desciption;
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
  for (const teacher of data.GetAllScheduleTeachers) {
    MapTeacher.set(
      {
        id: teacher.id,
        name: `${teacher.surname} ${teacher.name} ${teacher.patronymic}`,
      },
      teacher.assigned_teachers.length === 0
        ? []
        : GetSchedules(teacher.assigned_teachers)
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
        <ButtonGetDataFile
          refTable={this.refTable}
          nameTable="scheduleTableTeacher"
          wb={this.state.workBook}
          setWorkBook={this.setWorkBook}
        ></ButtonGetDataFile>
        <div className="table-responsive">
          <Table
            striped
            ref={this.refTable}
            bordered
            className="border border-dark"
          >
            <TableHead filters={filters}></TableHead>
          </Table>
        </div>
      </>
    );
  }
}
export default ScheduleTableTeacher;
