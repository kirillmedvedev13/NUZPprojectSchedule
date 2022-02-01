import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_WEEKS_DAY, GET_ALL_AUDIENCE_SCHEDULES } from "./queries";

function splitSamePairs(schedules) {
  let array = JSON.parse(JSON.stringify(schedules));
  let tempArr = [];
  let index = 0;
  let temp;
  while (index !== array.length - 1) {
    if (
      array[index].day_week.id === array[index + 1].day_week.id &&
      array[index].number_pair === array[index + 1].number_pair &&
      array[index].pair_type.id === array[index + 1].pair_type.id
    ) {
      temp = JSON.parse(JSON.stringify(array[index]));
      temp.assigned_group.group.name +=
        " " + array[index + 1].assigned_group.group.name;
      array.slice(index + 1, 1);
      index++;
      while (
        array[index].day_week.id === array[index + 1].day_week.id &&
        array[index].number_pair === array[index + 1].number_pair &&
        array[index].pair_type.id === array[index + 1].pair_type.id &&
        index !== array.length - 1
      ) {
        temp.assigned_group.group.name +=
          " " + array[index + 1].assigned_group.group.name;
        array.slice(index + 1, 1);
        index++;
      }
      tempArr.push(temp);
    } else {
      tempArr.push(array[index]);
    }
    index++;
  }
  return tempArr;
}
function DataTable({
  filters,
  handleSetItem,
  handleOpenDialog,
  handleOpenModal,
  handleUpdateItem,
  updateItem,
}) {
  const { id_audience, id_cathedra } = filters;
  const { loading, error, data } = useQuery(GET_ALL_AUDIENCE_SCHEDULES, {
    variables: {
      id_audience,
      id_cathedra,
    },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <tbody>
      {data.GetAllAudienceSchedules.map((audience) => {
        let newSchedules;
        if (!audience.schedules.length)
          return (
            <tr>
              <td>{audience.name}</td>
              <td colSpan={7}>Розкладу не має</td>
            </tr>
          );
        else if (audience.schedules.length === 1)
          newSchedules = audience.schedules;
        else newSchedules = splitSamePairs(audience.schedules);
        function* foo() {
          yield* newSchedules.map((object) => {
            return object;
          });
        }
        const schedules = foo();
        let schedule = schedules.next();
        return (
          <Fragment key={audience.id + "fr"}>
            <tr key={audience.id}>
              <td rowSpan="19" key={audience.id + audience.name}>
                {audience.name}
              </td>
            </tr>

            {[...Array(6)].map((i, number_pair) => {
              // обновлять индексы для каждого номера пары
              let arrScheduleTop = [null, null, null, null, null, null];
              let arrScheduleBot = [null, null, null, null, null, null];
              return (
                <Fragment>
                  <tr key={`${audience.key}-data-${number_pair + 1}`}>
                    <td rowSpan="3">{number_pair + 1}</td>
                  </tr>
                  {
                    // По числителю запоминать расписание
                    [...Array(6)].forEach((j, day_week) => {
                      if (!schedule.done) {
                        // проверка на то не закончились ли занятия для всех групп
                        if (
                          Number(schedule.value.day_week.id) ===
                            Number(day_week + 1) &&
                          Number(schedule.value.number_pair) ===
                            Number(number_pair + 1)
                        ) {
                          if (Number(schedule.value.pair_type.id) === 1) {
                            arrScheduleTop[day_week] = schedule.value;

                            schedule = schedules.next();
                          }
                        }
                      }
                    })
                  }
                  {
                    // По знаменателю запоминать расписание
                    [...Array(6)].forEach((j, day_week) => {
                      if (!schedule.done) {
                        // проверка на то не закончились ли занятия для всех групп
                        if (
                          Number(schedule.value.day_week.id) ===
                            Number(day_week + 1) &&
                          Number(schedule.value.number_pair) ===
                            Number(number_pair + 1)
                        ) {
                          if (Number(schedule.value.pair_type.id) === 2) {
                            arrScheduleBot[day_week] = schedule.value;
                            schedule = schedules.next();
                          }
                        }
                      }
                    })
                  }
                  {
                    // Общее запоминать расписание
                    [...Array(6)].forEach((j, day_week) => {
                      if (!schedule.done) {
                        // проверка на то не закончились ли занятия для всех групп
                        if (
                          Number(schedule.value.day_week.id) ===
                            Number(day_week + 1) &&
                          Number(schedule.value.number_pair) ===
                            Number(number_pair + 1)
                        ) {
                          if (Number(schedule.value.pair_type.id) === 3) {
                            arrScheduleTop[day_week] = schedule.value;
                            schedule = schedules.next();
                          }
                        }
                      }
                    })
                  }
                  <tr>
                    {
                      // Проходим по числителю
                      arrScheduleTop.map((schedule) => {
                        if (schedule === null) {
                          return <td></td>;
                        } else {
                          const desciption = `
                                ${
                                  schedule.assigned_group.class.type_class.name
                                } гр.${schedule.assigned_group.group.name} ${
                            schedule.assigned_group.class.assigned_discipline
                              .discipline.name
                          } ${schedule.assigned_group.class.assigned_teachers.map(
                            ({ teacher }) => {
                              return ` ${teacher.surname}`;
                            }
                          )}
                              `;
                          if (Number(schedule.pair_type.id) === 1) {
                            return <td>{desciption}</td>;
                          }
                          if (Number(schedule.pair_type.id) === 3) {
                            return <td rowSpan="2">{desciption}</td>;
                          }
                        }
                      })
                    }
                  </tr>
                  <tr>
                    {
                      // Проходим по знаменателю
                      arrScheduleBot.map((schedule, index) => {
                        if (schedule === null) {
                          if (arrScheduleTop[index] !== null) {
                            if (
                              Number(arrScheduleTop[index].pair_type.id) === 3
                            ) {
                              return null;
                            } else {
                              return <td></td>;
                            }
                          } else {
                            return <td></td>;
                          }
                        } else {
                          const desciption = `
                                ${
                                  schedule.assigned_group.class.type_class.name
                                } гр.${schedule.assigned_group.group.name} ${
                            schedule.assigned_group.class.assigned_discipline
                              .discipline.name
                          } ${schedule.assigned_group.class.assigned_teachers.map(
                            ({ teacher }) => {
                              return ` ${teacher.surname}`;
                            }
                          )}
                              `;
                          return <td>{desciption}</td>;
                        }
                      })
                    }
                  </tr>
                </Fragment>
              );
            })}
          </Fragment>
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
        <th>Аудиторія</th>
        <th>#</th>
        {data.GetWeeksDay.map((item) => {
          return <th key={item.id}>{item.name}</th>;
        })}
      </tr>
    </thead>
  );
}
class ScheduleTableAudience extends React.Component {
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
        <Table bordered>
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
export default ScheduleTableAudience;
