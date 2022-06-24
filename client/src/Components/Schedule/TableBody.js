import React, { Fragment } from "react";
export default function TableBody(MapSomething, info, getDescription) {
  return (
    <tbody>
      {[...MapSomething].map((map) => {
        let object = map[0];
        let array = map[1];
        return (
          <Fragment key={`${object.id}-Frag1`}>
            <tr key={object.id}>
              <td rowSpan={3 * info.max_pair + 1} key={object.id + object.name}>
                {object.name}
              </td>
            </tr>
            {[...Array(info.max_pair)].map((i, number_pair) => {
              let arrScheduleTop = new Array(info.max_day);
              let arrScheduleTotal = new Array(info.max_day);
              let arrScheduleBot = new Array(info.max_day);
              let checkPut = new Array(info.max_day);
              return (
                <Fragment key={`${object.id}-Frag2-${number_pair}`}>
                  <tr key={`${object.id}-data-${number_pair}`}>
                    <td
                      rowSpan="3"
                      key={`${object.id}-td-${number_pair}`}
                      className={
                        number_pair % 2 === 0 ? "table-active" : "table-default"
                      }
                    >
                      {number_pair + 1}
                    </td>
                  </tr>
                  {[...Array(info.max_day)].forEach((i, day_week) => {
                    // Заполнение массивов
                    arrScheduleTop[day_week] = array.filter(
                      (cl) =>
                        +cl.pair_type === 1 &&
                        +cl.number_pair === number_pair + 1 &&
                        +cl.day_week === day_week + 1
                    );
                    arrScheduleBot[day_week] = array.filter(
                      (cl) =>
                        +cl.pair_type === 2 &&
                        +cl.number_pair === number_pair + 1 &&
                        +cl.day_week === day_week + 1
                    );
                    arrScheduleTotal[day_week] = array.filter(
                      (cl) =>
                        +cl.pair_type === 3 &&
                        +cl.number_pair === number_pair + 1 &&
                        +cl.day_week === day_week + 1
                    );
                    // Проверка на накладку на этот день
                    if (arrScheduleTotal[day_week].length && (arrScheduleBot[day_week].length || arrScheduleTop[day_week].length)) {
                      checkPut[day_week] = false;
                    }
                    else if (arrScheduleTotal[day_week].length > 1 || arrScheduleBot[day_week].length > 1 || arrScheduleTop[day_week].length > 1) {
                      checkPut[day_week] = false;
                    }
                    else {
                      checkPut[day_week] = true;
                    }
                  })}
                  <tr>
                    {
                      // Вставка в таблицу ВВЕРХ
                      [...Array(info.max_day)].map((i, day_week) => {
                        // Если нету накладок, то обычная вставка
                        if (checkPut[day_week]) {
                          // Пара по числителю
                          if (arrScheduleTop[day_week][0]) {
                            return <td>{getDescription(arrScheduleTop[day_week][0])}</td>
                          }
                          // Общая пара
                          else if (arrScheduleTotal[day_week][0]) {
                            return <td>{getDescription(arrScheduleTotal[day_week][0])}</td>
                          }
                          // Если нету пары
                          else {
                            return <td></td>
                          }
                        }
                        // Если накладка
                        else {
                          let str = "";
                          if (arrScheduleTotal[day_week].length) {
                            str += "Загальна:"
                            arrScheduleTotal[day_week].forEach(sc => { str += getDescription(sc) })
                          }
                          if (arrScheduleTop[day_week].length) {
                            str += "Чисельник:"
                            arrScheduleTop[day_week].forEach(sc => { str += getDescription(sc) })
                          }
                          if (arrScheduleBot[day_week].length) {
                            str += "Знаменник:"
                            arrScheduleBot[day_week].forEach(sc => { str += getDescription(sc) })
                          }
                          return <td
                            rowSpan="2"
                          >{str}</td>
                        }
                      })
                    }
                  </tr>
                  <tr>
                    {
                      // Вставка в таблицу ВНИЗ
                      [...Array(info.max_day)].map((i, day_week) => {
                        // Если нету накладок, то обычная вставка
                        if (checkPut[day_week]) {
                          // Пара по знаменателю
                          if (arrScheduleBot[day_week][0]) {
                            return <td>{getDescription(arrScheduleBot[day_week][0])}</td>
                          }
                          // Если нету пары
                          else {
                            return <td></td>
                          }
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
