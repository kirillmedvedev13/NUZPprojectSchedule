import React, { Fragment } from "react";
export default function TableBody(MapSomething, info, getDescription) {
  return (
    <tbody>
      {[...MapSomething].map((mapSmth, mapIndex) => {
        let object = mapSmth[0];
        let array = mapSmth[1];
        return [...Array(info.max_pair * 2)].map((i, number_pair) => {
          let num_pair = Math.floor(number_pair / 2) + 1;
          let arrScheduleTop = new Array(info.max_day);
          let arrScheduleTotal = new Array(info.max_day);
          let arrScheduleBot = new Array(info.max_day);
          let checkPut = new Array(info.max_day);
          return (
            <tr key={`${object.id}-tr-${number_pair}`}>
              {number_pair === 0 ? (
                <td
                  rowSpan={2 * info.max_pair}
                  key={object.id + object.name}
                  style={{
                    backgroundColor: mapIndex % 2 === 0 ? "#E6CDE8" : "#FFFFFF",
                  }}
                >
                  {object.name}
                </td>
              ) : null}
              {number_pair % 2 === 0 ? (
                <td
                  rowSpan="2"
                  key={`${object.id}-td-${number_pair}`}
                  style={{
                    backgroundColor: num_pair % 2 === 1 ? "#D6D6D6" : "#FFFFFF",
                  }}
                >
                  {num_pair}
                </td>
              ) : null}
              {[...Array(info.max_day)].forEach((i, day_week) => {
                // Заполнение массивов
                arrScheduleTop[day_week] = array.filter(
                  (cl) =>
                    +cl.pair_type === 1 &&
                    +cl.number_pair === num_pair &&
                    +cl.day_week === day_week + 1
                );
                arrScheduleBot[day_week] = array.filter(
                  (cl) =>
                    +cl.pair_type === 2 &&
                    +cl.number_pair === num_pair &&
                    +cl.day_week === day_week + 1
                );
                arrScheduleTotal[day_week] = array.filter(
                  (cl) =>
                    +cl.pair_type === 3 &&
                    +cl.number_pair === num_pair &&
                    +cl.day_week === day_week + 1
                );
                // Проверка на накладку на этот день
                if (
                  arrScheduleTotal[day_week].length &&
                  (arrScheduleBot[day_week].length ||
                    arrScheduleTop[day_week].length)
                ) {
                  checkPut[day_week] = false;
                } else if (
                  arrScheduleTotal[day_week].length > 1 ||
                  arrScheduleBot[day_week].length > 1 ||
                  arrScheduleTop[day_week].length > 1
                ) {
                  checkPut[day_week] = false;
                } else {
                  checkPut[day_week] = true;
                }
              })}
              {number_pair % 2 === 0
                ? // Вставка в таблицу ВВЕРХ
                  [...Array(info.max_day)].map((i, day_week) => {
                    // Если нету накладок, то обычная вставка
                    if (checkPut[day_week]) {
                      // Пара по числителю
                      if (arrScheduleTop[day_week][0]) {
                        return (
                          <td
                            key={object.id + "tdTop" + number_pair + day_week}
                            style={{ backgroundColor: "#FFEC84" }}
                          >
                            {getDescription(arrScheduleTop[day_week][0])}
                          </td>
                        );
                      }
                      // Общая пара
                      else if (arrScheduleTotal[day_week][0]) {
                        return (
                          <td
                            rowSpan="2"
                            key={object.id + "tdTotal" + number_pair + day_week}
                            style={{ backgroundColor: "#ABFF84" }}
                          >
                            {getDescription(arrScheduleTotal[day_week][0])}
                          </td>
                        );
                      }
                      // Если нету пары
                      else {
                        return (
                          <td
                            key={object.id + "tdNull" + number_pair + day_week}
                          ></td>
                        );
                      }
                    }
                    // Если накладка
                    else {
                      let str = "";
                      if (arrScheduleTotal[day_week].length) {
                        str += "Загальна:";
                        arrScheduleTotal[day_week].forEach((sc) => {
                          str += getDescription(sc) + "\n";
                        });
                      }
                      if (arrScheduleTop[day_week].length) {
                        str += "Чисельник:";
                        arrScheduleTop[day_week].forEach((sc) => {
                          str += getDescription(sc) + "\n";
                        });
                      }
                      if (arrScheduleBot[day_week].length) {
                        str += "Знаменник:";
                        arrScheduleBot[day_week].forEach((sc) => {
                          str += getDescription(sc) + "\n";
                        });
                      }
                      return (
                        <td
                          key={object.id + "tdDanger" + number_pair + day_week}
                          rowSpan="2"
                          style={{ backgroundColor: "#FFAD84" }}
                        >
                          {str.split("\n").map((line, i) => {
                            return (
                              <p
                                key={
                                  object.id + "p" + number_pair + day_week + i
                                }
                              >
                                {line}
                              </p>
                            );
                          })}
                        </td>
                      );
                    }
                  })
                : [...Array(info.max_day)].map((i, day_week) => {
                    // Если нету накладок, то обычная вставка
                    if (checkPut[day_week]) {
                      if (!arrScheduleTotal[day_week][0]) {
                        // Пара по знаменателю
                        if (arrScheduleBot[day_week][0]) {
                          return (
                            <td
                              key={object.id + "tdBot" + number_pair + day_week}
                              style={{ backgroundColor: "#84ECFF" }}
                            >
                              {getDescription(arrScheduleBot[day_week][0])}
                            </td>
                          );
                        }
                        // Если нету пары
                        else {
                          return (
                            <td
                              key={
                                object.id + "tdNull1" + number_pair + day_week
                              }
                            ></td>
                          );
                        }
                      }
                    }
                    return null;
                  })}
            </tr>
          );
        });
      })}
    </tbody>
  );
}
