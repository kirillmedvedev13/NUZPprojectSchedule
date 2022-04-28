import { useQuery } from "@apollo/client";
import React, { Fragment } from "react";
import { Table } from "react-bootstrap";
import { GET_ALL_SCHEDULE_GROUPS } from "./queries";
import { DaysWeek } from "./DaysWeek";

function getDescription(schedule) {
  console.log(schedule)
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
  let temp = [];
  data.GetAllScheduleGroups.map(schedule => {
    if (schedule.assigned_group.group !== curGroup && !curGroup) {
      curGroup = schedule.assigned_group.group
    }
    if (schedule.assigned_group.group !== curGroup && curGroup) {
      MapGroup.set(curGroup, temp);
      curGroup = schedule.assigned_group.group
      temp = [];
    }
    temp.push(schedule);
  })
  MapGroup.set(curGroup, temp);

  return <tbody>
    {[...MapGroup].map(map => {
       let currentIndexSchedule = 0;
      return <Fragment>
      <tr key={map[0].id}>
        <td rowSpan={3 * info.max_pair + 1} key={map[0].id + map[0].name}>
          {map[0].name}
        </td>
      </tr>
      {
        [...Array(info.max_pair)].map((i, number_pair) => {
          console.log(currentIndexSchedule)
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
          { console.log(arrScheduleTop) }
          { console.log(arrScheduleBot) }
          return <Fragment>
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
                    if (+arrScheduleTop[index].pair_type === 3) {
                      return null;
                    }
                    return <td key={map[0].id + "tdNull" + number_pair + index}></td>
                  }
                })
              }
            </tr>
          </Fragment>
        })
      }
    </Fragment>
    })}
  </tbody>
}

class ScheduleTableGroup extends React.Component {
  render() {
    const { filters, info } = this.props;
    return (
      <Table bordered>
        <thead>
          <tr>
            <th>Група</th>
            <th>#</th>
            {[...Array(info?.max_day)].map((item, index) => {
              return <th key={index}>{DaysWeek[index]}</th>;
            })}
          </tr>
        </thead>
        <DataTable filters={filters} info={info}></DataTable>
      </Table>
    );
  }
}
export default ScheduleTableGroup;
