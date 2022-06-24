import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_ALL_SCHEDULE_AUDIENCES, GET_INFO } from "./queries";
import { DaysWeek } from "./DaysWeek";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import SplitPairs from "./SplitPairs";
import TableBody from "./TableBody";

function getDescription(schedule) {
  let teachers = " ";
  schedule.assigned_group.class.assigned_teachers.map((teacher) => {
    teachers +=
      teacher.teacher.surname +
      " " +
      teacher.teacher.name +
      " " +
      teacher.teacher.patronymic;
  });
  const desciption = `
   ${schedule.assigned_group.class.type_class.name} ${schedule.assigned_group.class.assigned_discipline.discipline.name} 
   ${schedule.assigned_group.group.name} 
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

function TableHead({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <thead>
        <tr>
          <th>Аудиторія</th>
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

class ScheduleTableAudience extends React.Component {
  render() {
    const { filters, info } = this.props;
    return (
      <>
        <div className="d-flex justify-content-end my-2">
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-primary"
            table="tableAudience"
            filename="tableAudienceSchedule"
            sheet="tablexls"
            buttonText="Завантажити XLS"
          />
        </div>
        <Table bordered>
          <TableHead filters={filters}></TableHead>
        </Table>
      </>
    );
  }
}
export default ScheduleTableAudience;
