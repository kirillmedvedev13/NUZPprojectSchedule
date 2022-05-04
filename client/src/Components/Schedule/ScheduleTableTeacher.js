import { GET_ALL_SCHEDULE_TEACHERS, GET_INFO } from "./queries";
import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { DaysWeek } from "./DaysWeek";

function getDescription(schedule) {
  const desciption = `
   ауд.${schedule.audience.name} ${schedule.assigned_group.group.name}
  ${schedule.assigned_group.class.type_class.name} ${schedule.assigned_group.class.assigned_discipline.discipline.name} 
  `;
  return desciption;
}

function GetTeachers(schedules) {
  let teachers = new Set();
  schedules.forEach((schedule) => {
    for (
      let i = 0;
      i < schedule.assigned_group.class.assigned_teachers.length;
      i++
    ) {
      teachers.add(schedule.assigned_group.class.assigned_teachers[i].teacher);
    }
  });
  return teachers;
}

function SortSchedule(schedule) {
  schedule.sort(function (schedule1, schedule2) {
    if (schedule1.day_week > schedule2.day_week) return 1;
    else if (schedule1.day_week === schedule2.day_week) {
      if (schedule1.number_pair > schedule2.number_pair) return 1;
      else if (schedule1.number_pair === schedule2.number_pair) {
        if (schedule1.pair_type > schedule2.pair_type) return 1;
        else if (schedule1.pair_type === schedule2.pair_type) {
          return 0;
        } else return -1;
      } else return -1;
    } else return -1;
  });
  let i = 1;
  let tempSched = [];
  let tempGroups = [];
  let flag = false;
  while (i < schedule.length) {
    if (
      schedule[i - 1].day_week === schedule[i].day_week &&
      schedule[i - 1].number_pair === schedule[i].number_pair &&
      schedule[i - 1].pair_type === schedule[i].pair_type &&
      schedule[i - 1].assigned_group.class.id ===
        schedule[i].assigned_group.class.id
    ) {
      tempGroups.push(schedule[i - 1].assigned_group.group.name);
      if (i == schedule.length - 1) {
        tempGroups.push(schedule[i].assigned_group.group.name);
        flag = true;
      }
    } else {
      tempGroups.push(schedule[i - 1].assigned_group.group.name);
      let copySched = JSON.parse(JSON.stringify(schedule[i - 1]));
      copySched.assigned_group.group.name = tempGroups.join();
      tempSched.push(copySched);
      tempGroups = [];
      if (i == schedule.length - 1 && !flag) tempSched.push(schedule[i]);
    }
    i++;
  }
  tempSched.sort(function (schedule1, schedule2) {
    if (schedule1.number_pair > schedule2.number_pair) return 1;
    else if (schedule1.number_pair === schedule2.number_pair) {
      if (schedule1.pair_type > schedule2.pair_type) return 1;
      else if (schedule1.pair_type === schedule2.pair_type) {
        if (schedule1.day_week > schedule2.day_week) return 1;
        else if (schedule1.day_week === schedule2.day_week) {
          return 0;
        } else return -1;
      } else return -1;
    } else return -1;
  });

  return schedule.length == 0 ? schedule : tempSched;
}
function DataTable({ filters, info }) {
  const { id_cathedra, id_group, id_specialty, semester } = filters;
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE_TEACHERS, {
    variables: {
      id_specialty,
      id_group,
      id_cathedra,
      semester,
    },
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  if (!data.GetAllScheduleTeachers.length) return <tbody></tbody>;
  let MapTeacher = new Map();
  let teachers = GetTeachers(data.GetAllScheduleTeachers);
  for (const teacher of teachers) {
    let temp = [];
    data.GetAllScheduleTeachers.forEach((schedule) => {
      for (
        let i = 0;
        i < schedule.assigned_group.class.assigned_teachers.length;
        i++
      ) {
        if (
          schedule.assigned_group.class.assigned_teachers[i].teacher.id ===
          teacher.id
        )
          temp.push(schedule);
      }
    });

    MapTeacher.set(teacher, SortSchedule(temp));
  }

  return (
    <tbody>
      {[...MapTeacher].map((map) => {
        let currentIndexSchedule = 0;
        return (
          <Fragment key={`${map[0].id}-Frag1`}>
            <tr key={map[0].id}>
              <td rowSpan={3 * info.max_pair + 1} key={map[0].id + map[0].name}>
                {`${map[0].surname} ${map[0].name} ${map[0].patronymic}`}
              </td>
            </tr>
            {[...Array(info.max_pair)].map((i, number_pair) => {
              let arrScheduleTop = [...Array(info.max_day)];
              let arrScheduleBot = [...Array(info.max_day)];
              // По числителю запоминать расписание
              while (
                +map[1][currentIndexSchedule]?.pair_type === 1 &&
                +map[1][currentIndexSchedule]?.number_pair === number_pair + 1
              ) {
                arrScheduleTop[+map[1][currentIndexSchedule].day_week - 1] =
                  map[1][currentIndexSchedule];
                currentIndexSchedule++;
              }
              // По знамен запоминать расписание
              while (
                +map[1][currentIndexSchedule]?.pair_type === 2 &&
                +map[1][currentIndexSchedule]?.number_pair === number_pair + 1
              ) {
                arrScheduleBot[+map[1][currentIndexSchedule].day_week - 1] =
                  map[1][currentIndexSchedule];
                currentIndexSchedule++;
              }
              // По общему запоминать расписание
              while (
                +map[1][currentIndexSchedule]?.pair_type === 3 &&
                +map[1][currentIndexSchedule]?.number_pair === number_pair + 1
              ) {
                arrScheduleTop[+map[1][currentIndexSchedule].day_week - 1] =
                  map[1][currentIndexSchedule];
                currentIndexSchedule++;
              }
              return (
                <Fragment key={`${map[0].id}-Frag2-${number_pair}`}>
                  <tr key={`${map[0].id}-data-${number_pair}`}>
                    <td
                      rowSpan="3"
                      key={`${map[0].id}-td-${number_pair}`}
                      className={
                        number_pair % 2 == 0 ? "table-active" : "table-default"
                      }
                    >
                      {number_pair + 1}
                    </td>
                  </tr>
                  <tr key={map[0].id + "trTop" + number_pair}>
                    {
                      // Проходим по числителю
                      arrScheduleTop.map((schedule, index) => {
                        if (schedule) {
                          if (+schedule.pair_type === 1) {
                            return (
                              <td
                                key={map[0].id + "tdTop" + number_pair + index}
                                className="table-warning"
                              >
                                {getDescription(schedule)}
                              </td>
                            );
                          }
                          if (+schedule.pair_type === 3) {
                            return (
                              <td
                                rowSpan="2"
                                key={
                                  map[0].id + "tdTotal" + number_pair + index
                                }
                                className="table-danger"
                              >
                                {getDescription(schedule)}
                              </td>
                            );
                          }
                        } else
                          return (
                            <td
                              key={map[0].id + "tdNull" + number_pair + index}
                            ></td>
                          );
                      })
                    }
                  </tr>
                  <tr key={map[0].id + "trBot" + number_pair}>
                    {
                      // Проходим по знаменателю
                      arrScheduleBot.map((schedule, index) => {
                        if (schedule) {
                          return (
                            <td
                              key={map[0].id + "tdBot" + number_pair + index}
                              className="table-info"
                            >
                              {getDescription(schedule)}
                            </td>
                          );
                        } else {
                          if (+arrScheduleTop[index]?.pair_type === 3) {
                            return null;
                          }
                          return (
                            <td
                              key={map[0].id + "tdNull" + number_pair + index}
                            ></td>
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

function TableHead({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO, {});
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
  render() {
    const { filters, info } = this.props;
    return (
      <Table bordered>
        <TableHead filters={filters}></TableHead>
      </Table>
    );
  }
}
export default ScheduleTableTeacher;
