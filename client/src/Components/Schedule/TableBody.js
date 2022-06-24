import React, { Fragment } from "react";
export default function TableBody(MapSomething, info, getDescription) {
  return (
    <tbody>
      {[...MapSomething].map((map) => {
        return (
          <Fragment key={`${map[0].id}-Frag1`}>
            <tr key={map[0].id}>
              <td rowSpan={3 * info.max_pair + 1} key={map[0].id + map[0].name}>
                {map[0].name}
              </td>
            </tr>
            {[...Array(info.max_pair)].map((i, number_pair) => {
              let arrScheduleTotal = [];
              let arrScheduleBot = [];
              return (
                <Fragment key={`${map[0].id}-Frag2-${number_pair}`}>
                  <tr key={`${map[0].id}-data-${number_pair}`}>
                    <td
                      rowSpan="3"
                      key={`${map[0].id}-td-${number_pair}`}
                      className={
                        number_pair % 2 === 0 ? "table-active" : "table-default"
                      }
                    >
                      {number_pair + 1}
                    </td>
                  </tr>
                  <tr key={map[0].id + "trTop" + number_pair}>
                    {[...Array(info.max_day)].map((i, day_week) => {
                      // По числителю запоминать расписание
                      let arrScheduleTop = map[1].filter(
                        (cl) =>
                          +cl.pair_type === 1 &&
                          +cl.number_pair === number_pair + 1 &&
                          +cl.day_week === day_week + 1
                      );

                      arrScheduleTotal = map[1].filter(
                        (cl) =>
                          +cl.pair_type === 3 &&
                          +cl.number_pair === number_pair + 1 &&
                          +cl.day_week === day_week + 1
                      );

                      if (arrScheduleTop.length) {
                        let description = "";

                        arrScheduleTop.forEach((cl) => {
                          description += getDescription(cl);
                        });
                        return (
                          <td
                            key={map[0].id + "tdTop" + number_pair + day_week}
                            className={
                              arrScheduleTop.length > 1
                                ? "table-danger"
                                : "table-warning"
                            }
                          >
                            {description}
                          </td>
                        );
                      } else if (arrScheduleTotal.length) {
                        let description = "";
                        arrScheduleTotal.forEach((cl) => {
                          description += getDescription(cl);
                        });
                        let isBot = arrScheduleBot.find(
                          (cl) =>
                            +cl.pair_type === 2 &&
                            +cl.number_pair === number_pair + 1 &&
                            +cl.day_week === day_week + 1
                        );
                        return (
                          <td
                            rowSpan="2"
                            key={map[0].id + "tdBoth" + number_pair + day_week}
                            className={
                              arrScheduleTotal.length > 1 || isBot
                                ? "table-danger"
                                : "table-success"
                            }
                          >
                            {description}
                          </td>
                        );
                      } else
                        return (
                          <td
                            key={map[0].id + "tdNull" + number_pair + day_week}
                          ></td>
                        );
                    })}
                  </tr>
                  <tr key={map[0].id + "trBot" + number_pair}>
                    {[...Array(info.max_day)].map((i, day_week) => {
                      arrScheduleBot = map[1].filter(
                        (cl) =>
                          +cl.pair_type === 2 &&
                          +cl.number_pair === number_pair + 1 &&
                          +cl.day_week === day_week + 1
                      );
                      let isTotal = arrScheduleTotal.find(
                        (cl) =>
                          +cl.pair_type === 3 &&
                          +cl.number_pair === number_pair + 1 &&
                          +cl.day_week === day_week + 1
                      );
                      if (isTotal) return null;
                      else if (arrScheduleBot.length) {
                        let description = "";
                        arrScheduleBot.forEach((cl) => {
                          description += getDescription(cl);
                        });

                        return (
                          <td
                            key={map[0].id + "tdBot" + number_pair + day_week}
                            className={
                              arrScheduleBot.length > 1
                                ? "table-danger"
                                : "table-info"
                            }
                          >
                            {description}
                          </td>
                        );
                      } else
                        return (
                          <td
                            key={map[0].id + "tdNull" + number_pair + day_week}
                          >
                            {map[0].id}
                          </td>
                        );
                    })}
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
