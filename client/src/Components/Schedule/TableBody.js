import React, { Fragment } from "react";
export default function TableBody(MapSomething, info, getDescription) {
  debugger;
  return (
    <tbody>
      {[...MapSomething].map((map) => {
        let currentIndexSchedule = 0;
        return (
          <Fragment key={`${map[0].id}-Frag1`}>
            <tr key={map[0].id}>
              <td rowSpan={3 * info.max_pair + 1} key={map[0].id + map[0].name}>
                {map[0].name}
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
