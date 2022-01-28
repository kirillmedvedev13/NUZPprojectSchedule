import { useQuery } from "@apollo/client";
import React, {Fragment} from "react";
import { Table } from "react-bootstrap";
import { XCircle, PencilSquare } from "react-bootstrap-icons";
import { GET_WEEKS_DAY, GET_ALL_SCHEDULES } from "./queries";

function getAndSortGroupSchedule(assigned_groups) { }
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

  function* foo() {
    let i = 0;
    yield* data.GetAllSchedules.map((object, index) => {
      return object;
    });
  }

  const schedules = foo();
  let schedule = schedules.next();
  let MapGroups = new Map();
  data.GetAllSchedules.map(schedule => {
    MapGroups.set(schedule.assigned_group.group.id, schedule.assigned_group.group)
  })
  const ArrGroups = Array.from(MapGroups).map(([key, value]) => ({ key, value }))

  return (
    <tbody>
      {
        ArrGroups.map((group) => {
          let arrIndexTotalPairType = [false, false, false, false, false, false];
          return (
            <Fragment>
              <tr key={group.key}> <td rowSpan="13" >{group.value.name}</td> </tr>
              {
                [...Array(12)].map((i, number_pair) => {
                  if ((number_pair + 1) % 2 === 1) { // обновлять индексы для каждого номера пары
                    arrIndexTotalPairType = [false, false, false, false, false, false];
                  }
                  return (
                    <tr key={`${group.key}-data-${number_pair + 1}`}>
                      {(number_pair + 1) % 2 === 1 && <td rowSpan="2">{number_pair / 2 + 1}</td>}
                      {
                        [...Array(6)].map((j, day_week) => {
                          let td = <td></td>
                          if (arrIndexTotalPairType[day_week]) { // если тру нужно пропустить клетку
                            td = null;
                          }
                          else {
                            if (!schedule.done) {// проверка на то не закончились ли занятия для всех групп
                              if (Number(schedule.value.day_week.id) === Number(day_week + 1) &&
                                (Number(schedule.value.number_pair) === Number((number_pair + 1) / 2 + 0.5) || Number(schedule.value.number_pair) === Number((number_pair + 1) / 2))) {
                                const descripion = `
                                ${schedule.value.assigned_group.class.type_class.name} ауд.${schedule.value.audience.name} ${schedule.value.assigned_group.class.assigned_discipline.discipline.name} ${schedule.value.assigned_group.class.assigned_teachers.map(({ teacher }) => {
                                  return ` ${teacher.surname}`
                                })
                                  }
                              `
                                if (Number(schedule.value.pair_type.id) === 1 || Number(schedule.value.pair_type.id) === 2) {// числитель или знаментаель
                                  td = <td>{descripion}</td>
                                }
                                else { // если общая пара то вставляется в 2 строки один раз за числителем
                                  td = <td rowSpan="2">{descripion}</td>
                                  arrIndexTotalPairType[day_week] = true; // отметка для того что бы в след строке не было клетки
                                }
                                schedule = schedules.next();
                              }
                            }
                          }
                          return td
                        })
                      }
                    </tr>
                  )
                })
              }
            </Fragment>
          )
        })
      }
    </tbody>
  )
}

function TableHead() {
  const { loading, error, data } = useQuery(GET_WEEKS_DAY, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <thead>
      <tr>
        <th>Група</th>
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
