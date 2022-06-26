import reviver from "./JSONReviver.js";

export default function Fitness(
  schedule,
  recommended_schedules,
  penaltySameRecSc,
  penaltyGrWin,
  penaltySameTimesSc,
  penaltyTeachWin
) {
  schedule = JSON.parse(schedule, reviver);
  for (let value of schedule.scheduleForGroups.values()) sortSchedule(value);
  for (let value of schedule.scheduleForTeachers.values()) sortSchedule(value);
  for (let value of schedule.scheduleForAudiences.values()) sortSchedule(value);
  let fitnessGr = fitnessByGroups(
    schedule.scheduleForGroups,

    penaltySameTimesSc,
    penaltyGrWin
  );
  let fitnessTeach = fitnessByTeachers(
    schedule.scheduleForTeachers,
    penaltySameTimesSc,
    penaltyTeachWin
  );
  let fitnessAud =
    penaltySameTimesSc === 0
      ? 0
      : fitnessByAudiences(schedule.scheduleForAudiences, penaltySameTimesSc);
  let fitnessSameRecSc =
    penaltySameRecSc === 0
      ? 0
      : fitnessSameSchedules(
          schedule.scheduleForAudiences,
          recommended_schedules,
          penaltySameRecSc
        );
  let fitnessValue =
    fitnessGr.fitnessValue +
    fitnessTeach.fitnessValue +
    fitnessAud.fitnessValue +
    fitnessSameRecSc;

  return {
    fitnessValue,
    fitnessGr,
    fitnessTeach,
    fitnessAud,
    fitnessSameRecSc,
  };
}

function sortSchedule(schedule) {
  schedule.sort(function (a, b) {
    if (a.day_week > b.day_week) return 1;
    if (a.day_week < b.day_week) return -1;
    if (a.number_pair > b.number_pair) return 1;
    if (a.number_pair < b.number_pair) return -1;
    if (a.pair_type > b.pair_type) return 1;
    if (a.pair_type < b.pair_type) return -1;
    return 0;
  });
}
function fitnessByGroups(schedule, penaltySameTimesSc, penaltyGrWin) {
  let fitnessGrWin = 0;
  let fitnessSameTimesSc = 0;
  for (let value of schedule.values()) {
    // fitnessGrWin +=
    //   penaltyGrWin === 0 ? 0 : fitnessWindows(value, penaltyGrWin);
    // fitnessSameTimesSc +=
    //   penaltySameTimesSc === 0
    //     ? 0
    //     : fitnessSameTimes(value, penaltySameTimesSc);
    let { fitnessSameTimes, fitnessWindows } = FitnessSameTimesAndWindows(
      value,
      penaltySameTimesSc,
      penaltyGrWin
    );
    fitnessGrWin += fitnessWindows;
    fitnessSameTimesSc += fitnessSameTimes;
  }
  let fitnessValue = fitnessGrWin + fitnessSameTimesSc;
  return {
    fitnessGrWin,
    fitnessSameTimesSc,
    fitnessValue,
  };
}
function fitnessByTeachers(schedule, penaltySameTimesSc, penaltyTeachWin) {
  let fitnessTeachWin = 0;
  let fitnessSameTimesSc = 0;
  for (let value of schedule.values()) {
    // fitnessTeachWin +=
    //   penaltyTeachWin === 0 ? 0 : fitnessWindows(value, penaltyTeachWin);

    // fitnessSameTimesSc +=
    //   penaltySameTimesSc === 0
    //     ? 0
    //     : fitnessSameTimes(value, penaltySameTimesSc);
    let { fitnessSameTimes, fitnessWindows } = FitnessSameTimesAndWindows(
      value,
      penaltySameTimesSc,
      penaltyTeachWin
    );
    fitnessTeachWin += fitnessWindows;
    fitnessSameTimesSc += fitnessSameTimes;
  }
  let fitnessValue = fitnessTeachWin + fitnessSameTimesSc;
  return {
    fitnessTeachWin,
    fitnessSameTimesSc,
    fitnessValue,
  };
}
function fitnessByAudiences(schedule, penaltySameTimesSc) {
  let fitnessSameTimesSc = 0;
  for (let value of schedule.values()) {
    fitnessSameTimesSc +=
      penaltySameTimesSc === 0
        ? 0
        : fitnessSameTimes(value, penaltySameTimesSc);
  }
  let fitnessValue = fitnessSameTimesSc;
  return {
    fitnessSameTimesSc,
    fitnessValue,
  };
}
function getClosePair(array) {
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] && max) {
      if (max.number_pair < array[i]?.number_pair) max = array[i];
    } else if (!max) max = array[i];
  }
  return max;
}

// function FitnessSameTimesAndWindows(schedule, penaltySameTimesSc, penaltyWin) {
//   let fitnessSameTimes = 0;
//   let fitnessWindows = 0;
//   let currentDay = -1;
//   let lastTop;
//   let lastBot;
//   let lastTotal;
//   for (let i = -1; i < schedule.length - 1; i++) {
//     // Переход на новый день
//     if (currentDay !== schedule[i + 1].day_week) {
//       currentDay = schedule[i + 1].day_week;
//       lastTop = null;
//       lastBot = null;
//       lastTotal = null;
//     }
//     // Если нету перехода на новый день
//     else {
//       if (schedule[i].pair_type === 1) {
//         lastTop = schedule[i];
//       }
//       else if (schedule[i].pair_type === 2) {
//         lastBot = schedule[i];
//       }
//       else if (schedule[i].pair_type === 3) {
//         lastTotal = schedule[i];
//       }
//       // Проверка накладки
//       if (schedule[i + 1].number_pair === schedule[i].number_pair) {
//         // Если пара общая а какая либо в эту пару числитель/знаменатель или одинаковый тип
//         if (schedule[i + 1].pair_type === 1 && (lastTop?.number_pair === schedule[i + 1].number_pair || lastTotal?.number_pair === schedule[i + 1].number_pair)) {
//           fitnessSameTimes += penaltySameTimesSc;
//           continue;
//         }
//         if (schedule[i + 1].pair_type === 2 && (lastBot?.number_pair === schedule[i + 1].number_pair || lastTotal?.number_pair === schedule[i + 1].number_pair)) {
//           fitnessSameTimes += penaltySameTimesSc;
//           continue;
//         }
//         if (schedule[i + 1].pair_type === 3 && (lastTop?.number_pair === schedule[i + 1].number_pair ||
//           lastBot?.number_pair === schedule[i + 1].number_pair || lastTotal?.number_pair === schedule[i + 1].number_pair)) {
//           fitnessSameTimes += penaltySameTimesSc;
//           continue;
//         }
//       }
//       // Проверка на окна
//       else {
//         // Если явное окно
//         if (schedule[i + 1].number_pair - schedule[i].number_pair > 1) {
//           fitnessWindows += (schedule[i + 1].number_pair - schedule[i].number_pair - 1) * penaltyWin;
//           continue;
//         }
//         // Если числитель/общая а перед ним знаменатель
//         if ((schedule[i + 1].pair_type === 1 || schedule[i + 1].pair_type === 3) && lastBot?.number_pair === schedule[i + 1].number_pair - 1) {
//           if (lastTop?.number_pair < schedule[i + 1].number_pair - 1) {
//             fitnessWindows += (schedule[i + 1].number_pair - lastTop?.number_pair - 1) * penaltyWin;
//             continue;
//           }
//           if (lastTotal?.number_pair < schedule[i + 1].number_pair - 1) {
//             fitnessWindows += (schedule[i + 1].number_pair - lastTotal?.number_pair - 1) * penaltyWin;
//             continue;
//           }
//         }
//         // Если знаменатель/общая а перед ним числитель
//         if ((schedule[i + 1].pair_type === 2 || schedule[i + 1].pair_type === 3)) {
//           if (lastTop?.number_pair === schedule[i + 1].number_pair - 1) {
//             if (lastBot?.number_pair < schedule[i + 1].number_pair - 1) {
//               fitnessWindows += (schedule[i + 1].number_pair - lastBot?.number_pair - 1) * penaltyWin;
//               continue;
//             }
//             if (lastTotal?.number_pair < schedule[i + 1].number_pair - 1) {
//               fitnessWindows += (schedule[i + 1].number_pair - lastTotal?.number_pair - 1) * penaltyWin;
//               continue;
//             }
//           }
//           if (schedule.find(sc => sc.day_week === currentDay && sc.number_pair === schedule[i + 1].number_pair - 1 && sc.pair_type === 1)) {
//             if (lastBot?.number_pair < schedule[i + 1].number_pair - 1) {
//               fitnessWindows += (schedule[i + 1].number_pair - lastBot?.number_pair - 1) * penaltyWin;
//               continue;
//             }
//             if (lastTotal?.number_pair < schedule[i + 1].number_pair - 1) {
//               fitnessWindows += (schedule[i + 1].number_pair - lastTotal?.number_pair - 1) * penaltyWin;
//               continue;
//             }
//           }
//         }
//       }
//     }
//   }
//   return { fitnessWindows, fitnessSameTimes }
// }

function FitnessSameTimesAndWindows(schedule, penaltySameTimesSc, penaltyWin) {
  let lastTop = null;
  let lastBot = null;
  let lastTotal = null;
  let fitnessWindows = 0;

  let fitnessSameTimes = 0;

  for (let i = 0; i < schedule.length - 1; i++) {
    if (+schedule.id_class === 2498) {
      console.log();
      console.log();
    }
    if (schedule[i].day_week === schedule[i + 1].day_week) {
      //накладки
      if (schedule[i].number_pair === schedule[i + 1].number_pair) {
        //все случае кроме если стоит числитель и знаменатель
        if (
          schedule[i].pair_type === schedule[i + 1].pair_type ||
          schedule[i].pair_type === 3 ||
          schedule[i + 1].pair_type === 3
        )
          fitnessSameTimes += penaltySameTimesSc;
      } else {
        switch (schedule[i].pair_type) {
          case 1:
            lastTop = schedule[i];
            break;
          case 2:
            lastBot = schedule[i];
            break;
          case 3:
            lastTotal = schedule[i];
            break;
        }
        let closePair =
          schedule[i + 1].pair_type === 3
            ? [
                getClosePair([lastTop, lastTotal]),
                getClosePair([lastBot, lastTotal]),
              ]
            : schedule[i + 1].pair_type === 2
            ? getClosePair([lastBot, lastTotal])
            : getClosePair([lastTop, lastTotal]);
        if (closePair)
          if (closePair?.length) {
            let closePair1 = closePair[0];
            let closePair2 = closePair[1];
            if (
              closePair1 &&
              closePair2 &&
              closePair1?.pair_type !== closePair2?.pair_type
            ) {
              /* if (
                schedule[i + 1].number_pair - closePair1.number_pair - 1 >
                0
              ) {
                console.log();
                console.log();
              }
              if (
                schedule[i + 1].number_pair - closePair2.number_pair - 1 >
                0
              ) {
                console.log();
                console.log();
              }*/
              fitnessWindows +=
                (schedule[i + 1].number_pair - closePair1.number_pair - 1) *
                penaltyWin;
              fitnessWindows +=
                (schedule[i + 1].number_pair - closePair2.number_pair - 1) *
                penaltyWin;
            } else {
              if (closePair1) {
                /* if (
                  schedule[i + 1].number_pair - closePair1.number_pair - 1 >
                  0
                ) {
                  console.log();
                  console.log();
                }*/
                fitnessWindows +=
                  (schedule[i + 1].number_pair - closePair1.number_pair - 1) *
                  penaltyWin;
              } else if (closePair2) {
                /* if (
                  schedule[i + 1].number_pair - closePair2.number_pair - 1 >
                  0
                ) {
                  console.log();
                  console.log();
                }*/

                fitnessWindows +=
                  (schedule[i + 1].number_pair - closePair2.number_pair - 1) *
                  penaltyWin;
              }
            }
          } else {
            /*if (schedule[i + 1].number_pair - closePair.number_pair - 1 > 0) {
              console.log();
              console.log();
            }*/
            fitnessWindows +=
              (schedule[i + 1].number_pair - closePair.number_pair - 1) *
              penaltyWin;
          }
      }
    } else {
      lastTop = null;
      lastBot = null;
      lastTotal = null;
    }
  }
  return { fitnessWindows, fitnessSameTimes };
}

function fitnessWindows(schedule, penaltyWin) {
  let fitnessValue = 0;
  let len = schedule.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (+schedule[i].day_week === +schedule[j].day_week) {
        if (+schedule[i].number_pair !== +schedule[j].number_pair) {
          if (schedule[i].pair_type === 3) {
            while (j < len && schedule[i].day_week === +schedule[j].day_week) {
              if (
                schedule[j - 1].pair_type !== schedule[j].pair_type &&
                schedule[j].pair_type !== 3
              )
                fitnessValue +=
                  (schedule[j].number_pair - schedule[i].number_pair - 1) *
                  penaltyWin;
              else break;
              j += 1;
            }
            break;
          }

          fitnessValue +=
            (schedule[j].number_pair - schedule[i].number_pair - 1) *
            penaltyWin;
          /*if (schedule[j].number_pair - schedule[i].number_pair - 1 > 0) {
            console.log();
            console.log();
          }*/
        }
        if (
          +schedule[i].pair_type === +schedule[j].pair_type ||
          +schedule[j].pair_type === 3
        )
          break;
      } else break;
    }
  }
  return fitnessValue;
}
function fitnessSameTimes(schedule, penaltySameTimesSc) {
  let fitnessValue = 0;
  let i = 0;
  while (i < schedule.length - 1) {
    //в границе одного дня
    if (schedule[i].day_week === schedule[i + 1].day_week) {
      //если у двух пар совпадает номер пары
      if (schedule[i].number_pair === schedule[i + 1].number_pair) {
        //все случае кроме если стоит числитель и знаменатель
        if (
          schedule[i].pair_type === schedule[i + 1].pair_type ||
          schedule[i].pair_type === 3 ||
          schedule[i + 1].pair_type === 3
        )
          fitnessValue += penaltySameTimesSc;
      }
    }
    i++;
  }
  return fitnessValue;
}

function fitnessSameSchedules(
  schedule,
  recommended_schedules,
  penaltySameRecSchedules
) {
  let fitnessSameRecSc = 0;
  for (let value of schedule.values()) {
    for (let clas of value) {
      let recSc = recommended_schedules.filter(
        (rs) => +rs.id_class === +clas.id_class
      );
      if (recSc.length) {
        let isSame = recSc.filter(
          (rs) =>
            +rs.day_week === +clas.day_week &&
            +rs.number_pair === +clas.number_pair
        );
        if (!isSame.length) fitnessSameRecSc += penaltySameRecSchedules;
      }
    }
  }
  return fitnessSameRecSc;
}
