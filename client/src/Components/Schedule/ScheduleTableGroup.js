import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_WEEKS_DAY, GET_ALL_SCHEDULES } from "./queries";

function DataTable({ filters }) {
  const { id_cathedra, id_group, id_specialty } = filters;
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULES, {
    variables: {
      id_specialty,
      id_group,
      id_cathedra,
    },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;

  function* foo() {
    yield* data.GetAllSchedules.map((object) => {
      return object;
    });
  }

  const schedules = foo();
  let schedule = schedules.next();
  let MapGroups = new Map();
  data.GetAllSchedules.forEach((schedule) => {
    MapGroups.set(
      schedule.assigned_group.group.id,
      schedule.assigned_group.group
    );
  });
  const ArrGroups = Array.from(MapGroups).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <tbody>
      {ArrGroups.map((group) => {
        return (
          <Fragment key={group.key + "fr"}>
            <tr key={group.key}>
              <td rowSpan="19" key={group.value.id + group.value.name}>
                {group.value.name}
              </td>
            </tr>
            {[...Array(6)].map((i, number_pair) => {
              // обновлять индексы для каждого номера пары
              let arrScheduleTop = [null, null, null, null, null, null];
              let arrScheduleBot = [null, null, null, null, null, null];
              return (
                <Fragment key={group.key + "frag" + number_pair}>
                  <tr key={`${group.key}-data-${number_pair + 1}`}>
                    <td rowSpan="3" key={`${group.key}-td-${number_pair + 1}`}>
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
                  <tr key={group.key + "trTop" + number_pair}>
                    {
                      // Проходим по числителю
                      arrScheduleTop.map((schedule, index) => {
                        if (schedule === null) {
                          return (
                            <td
                              key={group.key + "td" + number_pair + index}
                            ></td>
                          );
                        } else {
                          const desciption = `
                                ${
                                  schedule.assigned_group.class.type_class.name
                                } ауд.${schedule.audience.name} ${
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
                                  group.key +
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
                                  group.key +
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
                  <tr key={group.key + "trBot" + number_pair}>
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
                              return <td key={group.key + "td" + index}></td>;
                            }
                          } else {
                            return <td key={group.key + "td" + index}></td>;
                          }
                        } else {
                          const desciption = `
                                ${
                                  schedule.assigned_group.class.type_class.name
                                } ауд.${schedule.audience.name} ${
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
                                group.key +
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
        <th>Група</th>
        <th>#</th>
        {data.GetWeeksDay.map((item) => {
          return <th key={item.id}>{item.name}</th>;
        })}
      </tr>
    </thead>
  );
}
class ScheduleTableGroup extends React.Component {
  render() {
    const { filters } = this.props;

    return (
      <Table bordered>
        <TableHead />
        <DataTable filters={filters}></DataTable>
      </Table>
    );
  }
}
export default ScheduleTableGroup;
