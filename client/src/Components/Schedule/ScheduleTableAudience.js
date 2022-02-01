import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_WEEKS_DAY, GET_ALL_AUDIENCE_SCHEDULES } from "./queries";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

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
function DataTable({ filters }) {
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
        if (!audience.schedules.length) return;
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
                <Fragment key={audience.id + "frag" + number_pair}>
                  <tr key={`${audience.id}-data-${number_pair + 1}`}>
                    <td
                      rowSpan="3"
                      key={`${audience.id}-number-${number_pair + 1}`}
                    >
                      {number_pair + 1}
                    </td>
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
                  <tr key={audience.id + "trTop" + number_pair}>
                    {
                      // Проходим по числителю
                      arrScheduleTop.map((schedule, index) => {
                        if (schedule === null) {
                          return (
                            <td
                              key={audience.id + "td" + number_pair + index}
                            ></td>
                          );
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
                            return (
                              <td
                                key={
                                  audience.id +
                                  "td" +
                                  desciption +
                                  schedule.day_week.id
                                }
                              >
                                {desciption}
                              </td>
                            );
                          }
                          if (Number(schedule.pair_type.id) === 3) {
                            return (
                              <td
                                rowSpan="2"
                                key={
                                  audience.id +
                                  "td" +
                                  desciption +
                                  schedule.day_week.id
                                }
                              >
                                {desciption}
                              </td>
                            );
                          }
                        }
                      })
                    }
                  </tr>
                  <tr key={audience.id + "trBot" + number_pair}>
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
                              return (
                                <td
                                  key={audience.id + "td" + number_pair + index}
                                ></td>
                              );
                            }
                          } else {
                            return (
                              <td
                                key={audience.id + "td" + number_pair + index}
                              ></td>
                            );
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
                          return (
                            <td
                              key={
                                audience.id +
                                "td" +
                                desciption +
                                schedule.day_week.id
                              }
                            >
                              {desciption}
                            </td>
                          );
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
    const { filters } = this.props;

    return (
      <>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="tablexls"
          sheet="tablexls"
          buttonText="Download as XLS"
        />
        <Table bordered id={"table-to-xls"}>
          <TableHead />
          <DataTable filters={filters}></DataTable>
        </Table>
      </>
    );
  }
}
export default ScheduleTableAudience;
