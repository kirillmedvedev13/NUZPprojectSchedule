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
    penaltyGrWin,
    penaltySameTimesSc
  );
  let fitnessTeach = fitnessByTeachers(
    schedule.scheduleForTeachers,
    penaltyTeachWin,
    penaltySameTimesSc
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
          penaltySameTimesSc
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
    fitnessGrWin +=
      penaltyGrWin === 0 ? 0 : fitnessWindows(value, penaltyGrWin);
    fitnessSameTimesSc +=
      penaltySameTimesSc === 0
        ? 0
        : fitnessSameTimes(value, penaltySameTimesSc);
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
    fitnessTeachWin +=
      penaltyTeachWin === 0 ? 0 : fitnessWindows(value, penaltyTeachWin);

    fitnessSameTimesSc +=
      penaltySameTimesSc === 0
        ? 0
        : fitnessSameTimes(value, penaltySameTimesSc);
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
function fitnessWindows(schedule, penaltyGrWin) {
  let fitnessValue = 0;
  let len = schedule.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (schedule[i].day_week == schedule[j].day_week) {
        if (schedule[i].number_pair != schedule[j].number_pair)
          fitnessValue +=
            (schedule[j].number_pair - schedule[i].number_pair - 1) *
            penaltyGrWin;
        if (
          schedule[i].pair_type == schedule[j].pair_type ||
          schedule[j].pair_type == 3
        ) {
          break;
        }
      } else break;
    }
  }
  return fitnessValue;
}
function fitnessSameTimes(schedule, penaltySameTimesSc) {
  let fitnessValue = 0;
  let index = 1;
  while (index < schedule.length) {
    //в границе одного дня
    if (schedule[index - 1].day_week == schedule[index].day_week) {
      //если у двух пар совпадает номер пары
      if (schedule[index - 1].number_pair == schedule[index].number_pair) {
        //все случае кроме если стоит числитель и знаменатель
        if (
          schedule[index - 1].pair_type == schedule[index].pair_type ||
          schedule[index - 1].pair_type == 3 ||
          schedule[index].pair_type == 3
        )
          fitnessValue += penaltySameTimesSc;
      }
    }
    index++;
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
        (rs) =>
          rs.id_class === clas.id_class &&
          (rs.day_week !== clas.day_week || rs.number_pair !== clas.number_pair)
      );

      if (recSc.length) {
        fitnessSameRecSc += penaltySameRecSchedules * recSc.length;
      }
    }
  }
  return fitnessSameRecSc;
}
