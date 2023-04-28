import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { GET_ALL_SCHEDULE_GROUPS } from "./queries";
import { DaysWeek } from "./DaysWeek";
import TableBody from "./TableBody";
import SortSchedule from "./SortSchedule";
import ButtonGetDataFile from "./ButtonGetDataFile";

function getSchedulesForGroup(group) {
  let arrSched = [];
  for (let assigned_group of group.assigned_groups) {
    for (let schedule of assigned_group.class.schedules) {
      arrSched.push({
        number_pair: schedule.number_pair,
        day_week: schedule.day_week,
        pair_type: schedule.pair_type,
        audience: schedule.audience,
        class: {
          type_class: assigned_group.class.type_class,
          assigned_discipline: assigned_group.class.assigned_discipline,
          assigned_teachers: assigned_group.class.assigned_teachers,
        },
      });
    }
  }
  SortSchedule(arrSched);
  return arrSched;
}

function getDescription(schedule) {
  const desciption = `
  ${schedule.class.type_class.name} ауд.${schedule.audience.name} ${
    schedule.class.assigned_discipline.discipline.name
  } ${schedule.class.assigned_teachers.map(({ teacher }) => {
    return ` ${teacher.surname} ${teacher.name?.at(0)}.${teacher.patronymic?.at(
      0
    )}.`;
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
  let MapGroup = new Map();
  for (const group of data.GetAllScheduleGroups) {
    MapGroup.set(
      {
        id: group.id,
        name: `${group.specialty.cathedra.short_name}-${group.name}`,
      },
      group.assigned_groups.length === 0 ? [] : getSchedulesForGroup(group)
    );
  }
  return TableBody(MapGroup, info, getDescription);
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
        <ButtonGetDataFile
          info={info}
          refTable={this.refTable}
          nameTable="scheduleTableGroup"
          wb={this.state.workBook}
          setWorkBook={this.setWorkBook}
        ></ButtonGetDataFile>
        <div className="table-responsive">
          <Table
            striped
            bordered
            ref={this.refTable}
            className="border border-dark"
          >
            <TableHead info={info}></TableHead>
            <DataTable filters={filters} info={info}></DataTable>
          </Table>
        </div>
      </>
    );
  }
}
export default ScheduleTableGroup;
