import { useQuery } from "@apollo/client";
import React from "react";
import { Table, Button } from "react-bootstrap";
import { GET_ALL_SCHEDULE_AUDIENCES } from "./queries";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";
import GetGroupsName from "./GetGroupsName";
import ButtonGetTableExcel from "./ButtonGetTableExcel";
import SortSchedule from "./SortSchedule";

function GetSchedules(schedule) {
  let arrSched = [];
  for (let pair of schedule) {
    arrSched.push({
      id: pair.id,
      number_pair: pair.number_pair,
      day_week: pair.day_week,
      pair_type: pair.pair_type,
      class: {
        type_class: pair.class.type_class,
        assigned_discipline: pair.class.assigned_discipline,
        assigned_groups: pair.class.assigned_groups,
        assigned_teachers: pair.class.assigned_teachers,
      },
    });
  }
  SortSchedule(arrSched);
  return arrSched;
}
function getDescription(schedule) {
  let teachers = " ";
  schedule.class.assigned_teachers.forEach((teacher) => {
    teachers +=
      teacher.teacher.surname +
      " " +
      teacher.teacher.name +
      " " +
      teacher.teacher.patronymic;
  });
  const desciption = `
   ${schedule.class.type_class.name} ${schedule.class.assigned_discipline.discipline.name
    } 
   ${GetGroupsName(schedule.class.assigned_groups)} 
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
      audience.schedules.length === 0 ? [] : GetSchedules(audience.schedules)
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
