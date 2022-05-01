import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_ALL_SCHEDULE_GROUPS, GET_INFO } from "./queries";
import { DaysWeek } from "./DaysWeek";

function getDescription(schedule) {
  const desciption = `
  ${schedule.assigned_group.class.type_class.name
    } ауд.${schedule.audience.name} ${schedule.assigned_group.class.assigned_discipline
      .discipline.name
    } ${schedule.assigned_group.class.assigned_teachers.map(
      ({ teacher }) => {
        return ` ${teacher.surname}`;
      }
    )}
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
  let curGroup = null;
  let MapGroup = new Map();
  let temp_schedule = [];
  data.GetAllScheduleGroups.forEach(schedule => {
    if (schedule.assigned_group.group !== curGroup && !curGroup) {
      curGroup = schedule.assigned_group.group
    }
    if (schedule.assigned_group.group !== curGroup && curGroup) {
      MapGroup.set(curGroup, temp_schedule);
      curGroup = schedule.assigned_group.group
      temp_schedule = [];
    }
    temp_schedule.push(schedule);
  })
  if (curGroup)
    MapGroup.set(curGroup, temp_schedule);
  return <tbody>
    {[...MapGroup].map(map => {
      // Счётчик расписания для 1 группы
      let currentIndexSchedule = 0;
      return (<Fragment key={`${map[0].id}-Frag1`}>
        <tr key={map[0].id}>
          <td rowSpan={3 * info.max_pair + 1} key={map[0].id + map[0].name}>
            {`${map[0].specialty.cathedra.short_name}-${map[0].name}`}
          </td>
        </tr>
        {
          [...Array(info.max_pair)].map((i, number_pair) => {
            let arrScheduleTop = [...Array(info.max_day)];
            let arrScheduleBot = [...Array(info.max_day)];
            // По числителю запоминать расписание
            while (+map[1][currentIndexSchedule]?.pair_type === 1 && +map[1][currentIndexSchedule]?.number_pair === number_pair + 1) {
              arrScheduleTop[+map[1][currentIndexSchedule].day_week - 1] = map[1][currentIndexSchedule];
              currentIndexSchedule++;
            }
            // По знамен запоминать расписание
            while (+map[1][currentIndexSchedule]?.pair_type === 2 && +map[1][currentIndexSchedule]?.number_pair === number_pair + 1) {
              arrScheduleBot[+map[1][currentIndexSchedule].day_week - 1] = map[1][currentIndexSchedule];
              currentIndexSchedule++;
            }
            // По общему запоминать расписание
            while (+map[1][currentIndexSchedule]?.pair_type === 3 && +map[1][currentIndexSchedule]?.number_pair === number_pair + 1) {
              arrScheduleTop[+map[1][currentIndexSchedule].day_week - 1] = map[1][currentIndexSchedule];
              currentIndexSchedule++;
            }
            return (<Fragment key={`${map[0].id}-Frag2-${number_pair}`}>
              <tr key={`${map[0].id}-data-${number_pair}`}>
                <td rowSpan="3" key={`${map[0].id}-td-${number_pair}`}>
                  {number_pair + 1}
                </td>
              </tr>
              <tr key={map[0].id + "trTop" + number_pair}>
                {
                  // Проходим по числителю
                  arrScheduleTop.map((schedule, index) => {
                    if (schedule) {
                      if (+schedule.pair_type === 1) {
                        return <td key={map[0].id + "tdTop" + number_pair + index}>
                          {getDescription(schedule)}
                        </td>
                      }
                      if (+schedule.pair_type === 3) {
                        return <td rowSpan="2" key={map[0].id + "tdTotal" + number_pair + index}>
                          {getDescription(schedule)}
                        </td>
                      }
                    }
                    else
                      return <td key={map[0].id + "tdNull" + number_pair + index}></td>
                  }
                  )
                }
              </tr>
              <tr key={map[0].id + "trBot" + number_pair}>
                {
                  // Проходим по знаменателю
                  arrScheduleBot.map((schedule, index) => {
                    if (schedule) {
                      return <td key={map[0].id + "tdBot" + number_pair + index}>
                        {getDescription(schedule)}
                      </td>
                    } else {
                      if (+arrScheduleTop[index]?.pair_type === 3) {
                        return null;
                      }
                      return <td key={map[0].id + "tdNull" + number_pair + index}></td>
                    }
                  })
                }
              </tr>
            </Fragment>)
          })
        }
      </Fragment>)
    })}
  </tbody>
}

function TableHead({ filters }) {
  const { loading, error, data } = useQuery(GET_INFO, {});
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <>
      <thead>
        <tr>
          <th>Група</th>
          <th>#</th>
          {[...Array(data.GetInfo.max_day)].map((i, index) => {
            return <th key={DaysWeek[index]}>{DaysWeek[index]}</th>
          })}
        </tr>
      </thead>
      <DataTable filters={filters} info={data.GetInfo}></DataTable>
    </>
  );
}

class ScheduleTableGroup extends React.Component {

  render() {
    const { filters, info } = this.props;
    return (
      <Table bordered>
        <TableHead filters={filters}></TableHead>
      </Table>
    );
  }
}
export default ScheduleTableGroup;
