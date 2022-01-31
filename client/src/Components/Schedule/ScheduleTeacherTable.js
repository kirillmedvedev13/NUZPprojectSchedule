import { GET_ALL_SCHEDULE_TEACHERS, GET_WEEKS_DAY } from "./queries"
import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";

function DataTable({
  filters
}) {
  const { loading, error, data } = useQuery(GET_ALL_SCHEDULE_TEACHERS, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;

  let MapTeacher = new Map();

  data.GetAllScheduleTeachers.map((schedule) => {
    schedule.assigned_group.class.assigned_teachers.map(at => {
      let data = null;
      let temp = MapTeacher.get(Number(at.teacher.id));
      if (temp) {
        let temparr = temp.schedule;
        temparr.push(schedule);
        data = temparr;
      }
      else {
        data = [schedule]
      }
      MapTeacher.set(Number(at.teacher.id), {teacher: at.teacher, schedule:data});
    })
  });
  console.log(MapTeacher)

  const ArrTeachers = Array.from(MapTeacher).map(([key, value]) => ({
    key,
    value,
  }));
  const number_pairs = 6;
  const number_days = 6;
  console.log(ArrTeachers)
  return (
    <tbody>
      {ArrTeachers.map((teacher) => {
        let currentIndexSchedule = 0
        return (
          <Fragment>
            <tr>
              <td rowSpan="19" >
                {`${teacher.value.teacher.surname} ${teacher.value.teacher.name} ${teacher.value.teacher.patronymic}`}
              </td>
            </tr>
            {[...Array(number_pairs)].map((i, number_pair) => {
              // обновлять индексы для каждого номера пары
              let arrScheduleTop = [
                null,
                null,
                null,
                null,
                null,
                null,
              ];
              let arrScheduleBot = [
                null,
                null,
                null,
                null,
                null,
                null,
              ];
              return (
                <Fragment>
                  <tr>
                    <td rowSpan="3">
                      {number_pair + 1}
                    </td>
                  </tr>
                  { // По числителю запоминать расписание
                    [...Array(number_days)].forEach((j, day_week) => {
                      if (teacher.value.schedule.length !== currentIndexSchedule) {
                        // проверка на то не закончились ли занятия для учителя
                        if (Number(teacher.value.schedule[currentIndexSchedule].day_week.id) === Number(day_week + 1) && Number(teacher.value.schedule[currentIndexSchedule].number_pair) === Number(number_pair + 1)) {
                          if (Number(teacher.value.schedule[currentIndexSchedule].pair_type.id) === 1) {
                            let currentTeacher = teacher.value.schedule[currentIndexSchedule];
                            while (currentTeacher.day_week.id === teacher.value.schedule[currentIndexSchedule].day_week.id 
                              && currentTeacher.number_pair === teacher.value.schedule[currentIndexSchedule].number_pair
                              && currentTeacher.pair_type.id === teacher.value.schedule[currentIndexSchedule].pair_type.id) {
                              if (arrScheduleTop[day_week]) {
                                let temp = arrScheduleTop[day_week];
                                temp = {
                                  teacher: temp.teacher,
                                  groups: [...temp.groups, teacher.value.schedule[currentIndexSchedule].assigned_group.group]
                                }
                                arrScheduleTop[day_week] = temp;
                              }
                              else {
                                arrScheduleTop[day_week] = { teacher: teacher.value.schedule[currentIndexSchedule], groups: [teacher.value.schedule[currentIndexSchedule].assigned_group.group] }
                              }
                              currentTeacher = teacher.value.schedule[currentIndexSchedule];
                              currentIndexSchedule++;
                              if (currentIndexSchedule === teacher.value.schedule.length) {
                                break;
                              }
                            }
                          }
                        }
                      }
                    })
                  }
                  {// По знаменателю запоминать расписание
                    [...Array(number_days)].forEach((j, day_week) => {
                      if (teacher.value.schedule.length !== currentIndexSchedule) {
                        // проверка на то не закончились ли занятия для учителя
                        if (Number(teacher.value.schedule[currentIndexSchedule].day_week.id) === Number(day_week + 1) && Number(teacher.value.schedule[currentIndexSchedule].number_pair) === Number(number_pair + 1)) {
                          if (Number(teacher.value.schedule[currentIndexSchedule].pair_type.id) === 2) {
                            let currentTeacher = teacher.value.schedule[currentIndexSchedule];
                            while (currentTeacher.day_week.id === teacher.value.schedule[currentIndexSchedule].day_week.id 
                              && currentTeacher.number_pair === teacher.value.schedule[currentIndexSchedule].number_pair
                              && currentTeacher.pair_type.id === teacher.value.schedule[currentIndexSchedule].pair_type.id) {
                              if (arrScheduleBot[day_week]) {
                                let temp = arrScheduleBot[day_week];
                                temp = {
                                  teacher: temp.teacher,
                                  groups: [...temp.groups, teacher.value.schedule[currentIndexSchedule].assigned_group.group]
                                }
                                arrScheduleBot[day_week] = temp;
                              }
                              else {
                                arrScheduleBot[day_week] = { teacher: teacher.value.schedule[currentIndexSchedule], groups: [teacher.value.schedule[currentIndexSchedule].assigned_group.group] }
                              }
                              currentTeacher = teacher.value.schedule[currentIndexSchedule];
                              currentIndexSchedule++;
                              if (currentIndexSchedule === teacher.value.schedule.length) {
                                break;
                              }
                            }
                          }
                        }
                      }
                    })
                  }
                  {// Общее запоминать расписание
                    [...Array(number_days)].forEach((j, day_week) => {
                      if (teacher.value.schedule.length !== currentIndexSchedule) {
                        // проверка на то не закончились ли занятия для учителя
                        if (Number(teacher.value.schedule[currentIndexSchedule].day_week.id) === Number(day_week + 1) && Number(teacher.value.schedule[currentIndexSchedule].number_pair) === Number(number_pair + 1)) {
                          if (Number(teacher.value.schedule[currentIndexSchedule].pair_type.id) === 3) {
                            let currentTeacher = teacher.value.schedule[currentIndexSchedule];
                            while (currentTeacher.day_week.id === teacher.value.schedule[currentIndexSchedule].day_week.id 
                              && currentTeacher.number_pair === teacher.value.schedule[currentIndexSchedule].number_pair
                              && currentTeacher.pair_type.id === teacher.value.schedule[currentIndexSchedule].pair_type.id) {
                              if (arrScheduleTop[day_week]) {
                                let temp = arrScheduleTop[day_week];
                                temp = {
                                  teacher: temp.teacher,
                                  groups: [...temp.groups, teacher.value.schedule[currentIndexSchedule].assigned_group.group]
                                }
                                arrScheduleTop[day_week] = temp;
                              }
                              else {
                                arrScheduleTop[day_week] = { teacher: teacher.value.schedule[currentIndexSchedule], groups: [teacher.value.schedule[currentIndexSchedule].assigned_group.group] }
                              }
                              currentTeacher = teacher.value.schedule[currentIndexSchedule];
                              currentIndexSchedule++;
                              if (currentIndexSchedule === teacher.value.schedule.length) {
                                break;
                              }
                            }
                          }
                        }
                      }
                    })
                  }
                  {console.log(arrScheduleTop)}
                  {console.log(arrScheduleBot)}
                  <tr>
                    {
                      // Проходим по числителю
                      arrScheduleTop.map(schedule => {
                        if (schedule === null) {
                          return <td></td>
                        }
                        else {
                          const desciption = `
                          ${schedule.teacher.assigned_group.class.type_class
                              .name
                            } ауд.${schedule.teacher.audience.name} ${schedule.teacher.assigned_group.class
                              .assigned_discipline.discipline.name
                            } ${schedule.groups.map(
                              (group) => {
                                return ` ${group.name}`;
                              }
                            )}
                        `;
                          if (Number(schedule.teacher.pair_type.id) === 1) {
                            return <td>{desciption}</td>
                          }
                          if (Number(schedule.teacher.pair_type.id) === 3) {
                            return <td rowSpan="2">{desciption}</td>
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
                            if (Number(arrScheduleTop[index].teacher.pair_type.id) === 3) {
                              return null
                            }
                            else {
                              return <td></td>
                            }
                          }
                          else {
                            return <td></td>
                          }
                        }
                        else {
                          const desciption = `
                          ${schedule.teacher.assigned_group.class.type_class
                              .name
                            } ауд.${schedule.teacher.audience.name} ${schedule.teacher.assigned_group.class
                              .assigned_discipline.discipline.name
                            } ${schedule.groups.map(
                              (group) => {
                                return ` ${group.name}`;
                              }
                            )}
                        `;
                          return <td>{desciption}</td>
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
        <th>Вчитель</th>
        <th>#</th>
        {data.GetWeeksDay.map((item) => {
          return <th key={item.id}>{item.name}</th>;
        })}
      </tr>
    </thead>
  );
}
class ScheduleTeacherTable extends React.Component {
  render() {
    const {
      filters,
    } = this.props;

    return (
      <div className="container-fluid w-100">
        <Table bordered >
          <TableHead />
          <DataTable
            filters={filters}
          ></DataTable>
        </Table>
      </div>
    );
  }
}
export default ScheduleTeacherTable;
