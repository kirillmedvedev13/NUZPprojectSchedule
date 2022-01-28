import { useQuery } from "@apollo/client";
import React from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_WEEKS_DAY, GET_ALL_SCHEDULES } from "./queries";

function getAndSortGroupSchedule(assigned_groups) {}
function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  handleUpdateItem,
  updateItem,
}) {
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULES, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  let temp;
  function* foo() {
    let i = 0;
    yield* data.GetAllSchedules.map((object, index) => {
      return object;
    });
  }
  const schedules = foo();
  let schedule = schedules.next();
  const array = [1, 2, 3, 4, 5, 6];
  return (
    <tbody>
      {[...Array(6)].map((i, number_pair) => {
        [...Array(6)].map((j, day_week) => {
          console.log(schedule.value.day_week.id, day_week);
          console.log(schedule.value.number_pair, number_pair);
          if (
            Number(schedule.value.number_pair) === Number(number_pair) &&
            Number(schedule.value.day_week.id) === Number(day_week)
          ) {
            let data;
            switch (schedule.value.pair_type.id) {
              case 1:
                data = (
                  <tr>
                    <td>{schedule.value.assigned_group.discipline.name}</td>
                    <td></td>
                  </tr>
                );
                break;
              case 2:
                data = (
                  <tr>
                    <td></td>
                    <td>
                      {
                        schedule.value.assigned_group.class.assigned_discipline
                          .discipline.name
                      }
                    </td>
                  </tr>
                );
                break;
              default:
                data = (
                  <tr>
                    <td>
                      {
                        schedule.value.assigned_group.class.assigned_discipline
                          .discipline.name
                      }
                    </td>
                  </tr>
                );
                break;
            }
            console.log(data);
            schedule = schedules.next();
            return data;
          }
        });
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
        <th>#</th>
        {data.GetWeeksDay.map((item) => {
          return <th key={item.id}>{item.name}</th>;
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
