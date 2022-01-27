import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_WEEKS_DAY, GET_ALL_GROUP_SCHEDULES } from "./queries";

function getAndSortGroupSchedule(assigned_groups) {
  let arraySchedule = [];
  assigned_groups.forEach((arr) => {
    arr.schedules.forEach((pair) => {
      arraySchedule.push(pair);
    });
  });
  arraySchedule.sort((right, left) => {
    if (right.day_week.id < left.day_week.id) return 1;
    else return -1;
  });
  arraySchedule.sort((right, left) => {
    if (right.number_pair < left.number_pair) return 1;
    else return -1;
  });
  arraySchedule.sort((right, left) => {
    if (right.pair_type.id < left.pair_type.id) return 1;
    else return -1;
  });
  return arraySchedule;
}
function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  handleUpdateItem,
  updateItem,
}) {
  const { loading, error, data } = useQuery(GET_ALL_GROUP_SCHEDULES, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let arrayData = data.GetAllGroupSchedules.map((item) => {
    return {
      id: item.id,
      name: item.name,
      schedule: getAndSortGroupSchedule(item.assigned_groups),
    };
  });
  return (
    <tbody>
      {arrayData.map((group) => {
        return (
          <tr key={group.id}>
            <td>{group.name}</td>
          </tr>
        );
      })}
    </tbody>
  );
}

function TableHead() {
  const { loading, error, data } = useQuery(GET_WEEKS_DAY, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <thead>
      <tr>
        <th></th>
        {data.GetWeeksDay.map((item) => {
          return <th>{item.name}</th>;
        })}
      </tr>
    </thead>
  );
}
class ScheduleGroupTable extends React.Component {
  render() {
    const {
      filters,
      handleOpenModal,
      handleOpenDialog,
      handleSetItem,
      updateItem,
      handleUpdateItem,
    } = this.props;

    return (
      <div className="container-fluid w-100">
        <Table striped bordered hover>
          <TableHead />
          <DataTable
            filters={filters}
            handleSetItem={handleSetItem}
            handleOpenDialog={handleOpenDialog}
            handleOpenModal={handleOpenModal}
            handleUpdateItem={handleUpdateItem}
            updateItem={updateItem}
          ></DataTable>
        </Table>
      </div>
    );
  }
}
export default ScheduleGroupTable;
