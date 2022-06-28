import reviver from "./JSONReviver.js";

export default function Fitness(
  schedule,
  recommended_schedules,
  max_day,
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
  if (array[0]) {
    if (array[1]) {
      if (array[0].number_pair <= array[1].number_pair) return array[1];
      else return array[0];
    } else return array[0];
  } else return array[1];
}
function getFitnessFromClosePair(
  schedule,
  lastTop,
  lastBot,
  lastTotal,
  penaltyWin
) {
  let fitnessWindows = 0;
  let closePair =
    schedule.pair_type === 3
      ? [getClosePair([lastTop, lastTotal]), getClosePair([lastBot, lastTotal])]
      : schedule.pair_type === 2
      ? getClosePair([lastBot, lastTotal])
      : getClosePair([lastTop, lastTotal]);
  if (closePair) {
    if (closePair.length) {
      if (
        closePair[0] &&
        closePair[1] &&
        closePair[0].pair_type !== closePair[1].pair_type
      ) {
        fitnessWindows +=
          (schedule.number_pair - closePair[0].number_pair - 1) * penaltyWin;
        fitnessWindows +=
          (schedule.number_pair - closePair[1].number_pair - 1) * penaltyWin;
      } else {
        if (closePair[0]) {
          fitnessWindows +=
            (schedule.number_pair - closePair[0].number_pair - 1) * penaltyWin;
        } else if (closePair[1]) {
          fitnessWindows +=
            (schedule.number_pair - closePair[1].number_pair - 1) * penaltyWin;
        }
      }
    } else {
      fitnessWindows +=
        (schedule.number_pair - closePair.number_pair - 1) * penaltyWin;
    }
  }
  return fitnessWindows;
}

function FitnessSameTimesAndWindows(schedule, penaltySameTimesSc, penaltyWin) {
  let lastTop = null;
  let lastBot = null;
  let lastTotal = null;
  let fitnessWindows = 0;
  let fitnessSameTimes = 0;
  for (let i = 0; i < schedule.length - 1; i++) {
    if (schedule[i].day_week === schedule[i + 1].day_week) {
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
      //накладки
      if (schedule[i].number_pair === schedule[i + 1].number_pair) {
        //все случае кроме если стоит числитель и знаменатель
        fitnessWindows += getFitnessFromClosePair(
          schedule[i + 1],
          lastTop,
          lastBot,
          lastTotal,
          penaltyWin
        );
        if (
          schedule[i].pair_type === schedule[i + 1].pair_type ||
          schedule[i].pair_type === 3 ||
          schedule[i + 1].pair_type === 3
        )
          fitnessSameTimes += penaltySameTimesSc;
      } else {
        fitnessWindows += getFitnessFromClosePair(
          schedule[i + 1],
          lastTop,
          lastBot,
          lastTotal,
          penaltyWin
        );
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
