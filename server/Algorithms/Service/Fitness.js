export default function Fitness(
  schedule,
  recommended_schedules,
  max_day,
  penaltySameRecSc,
  penaltyGrWin,
  penaltySameTimesSc,
  penaltyTeachWin
) {
  for (let value of schedule.scheduleForGroups.values()) sortSchedule(value);
  for (let value of schedule.scheduleForTeachers.values()) sortSchedule(value);
  for (let value of schedule.scheduleForAudiences.values()) sortSchedule(value);
  let fitnessGr = fitnessByGroups(
    schedule.scheduleForGroups,
    max_day,
    penaltySameTimesSc,
    penaltyGrWin
  );
  let fitnessTeach = fitnessByTeachers(
    schedule.scheduleForTeachers,
    max_day,
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
      : fitnessSameSchedules(recommended_schedules, penaltySameRecSc);
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
function fitnessByGroups(schedule, max_day, penaltySameTimesSc, penaltyGrWin) {
  let fitnessGrWin = 0;
  let fitnessSameTimesSc = 0;
  for (let value of schedule.values()) {
    fitnessGrWin +=
      penaltyGrWin === 0 ? 0 : fitnessWindows(value, max_day, penaltyGrWin);
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
function fitnessByTeachers(
  schedule,
  max_day,
  penaltySameTimesSc,
  penaltyTeachWin
) {
  let fitnessTeachWin = 0;
  let fitnessSameTimesSc = 0;
  for (let value of schedule.values()) {
    fitnessTeachWin +=
      penaltyTeachWin === 0
        ? 0
        : fitnessWindows(value, max_day, penaltyTeachWin);

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

function fitnessSameTimes(schedule, penaltySameTimesSc) {
  let fitnessSameTimes = 0;
  let lastTop;
  let lastBot;
  let lastTotal;
  let cur_day = -1;
  for (let i = -1; i < schedule.length - 1; i++) {
    if (schedule[i + 1].day_week !== cur_day) {
      cur_day = schedule[i + 1].day_week;
      lastTop = null;
      lastBot = null;
      lastTotal = null;
      continue;
    }
    if (schedule[i].pair_type === 1) {
      lastTop = schedule[i];
    } else if (schedule[i].pair_type === 2) {
      lastBot = schedule[i];
    } else if (schedule[i].pair_type === 3) {
      lastTotal = schedule[i];
    }
    // Проверка накладки
    if (schedule[i + 1].number_pair === schedule[i].number_pair) {
      // Если пара общая а какая либо в эту пару числитель/знаменатель или одинаковый тип
      if (
        schedule[i + 1].pair_type === 1 &&
        (lastTop?.number_pair === schedule[i + 1].number_pair ||
          lastTotal?.number_pair === schedule[i + 1].number_pair)
      ) {
        fitnessSameTimes += penaltySameTimesSc;
        continue;
      }
      if (
        schedule[i + 1].pair_type === 2 &&
        (lastBot?.number_pair === schedule[i + 1].number_pair ||
          lastTotal?.number_pair === schedule[i + 1].number_pair)
      ) {
        fitnessSameTimes += penaltySameTimesSc;
        continue;
      }
      if (
        schedule[i + 1].pair_type === 3 &&
        (lastTop?.number_pair === schedule[i + 1].number_pair ||
          lastBot?.number_pair === schedule[i + 1].number_pair ||
          lastTotal?.number_pair === schedule[i + 1].number_pair)
      ) {
        fitnessSameTimes += penaltySameTimesSc;
        continue;
      }
    }
  }
  return fitnessSameTimes;
}

function fitnessWindows(schedule, max_day, penaltyWin) {
  let fitnessWindows = 0;
  for (let currentDay = 1; currentDay <= max_day; currentDay++) {
    let schedule_top = schedule.filter(
      (sc) =>
        (sc.pair_type === 1 || sc.pair_type === 3) && sc.day_week === currentDay
    );
    let schedule_bot = schedule.filter(
      (sc) =>
        (sc.pair_type === 2 || sc.pair_type === 3) && sc.day_week === currentDay
    );
    let array = [];
    for (let i = 0; i < schedule_top.length - 1; i++) {
      if (schedule_top[i + 1].number_pair - schedule_top[i].number_pair > 1) {
        fitnessWindows +=
          (schedule_top[i + 1].number_pair - schedule_top[i].number_pair - 1) *
          penaltyWin;
        if (
          schedule_top[i + 1].pair_type === 3 &&
          schedule_top[i].pair_type === 3
        ) {
          array.push([schedule_top[i], schedule_top[i + 1]]);
        }
      }
    }
    for (let i = 0; i < schedule_bot.length - 1; i++) {
      if (schedule_bot[i + 1].number_pair - schedule_bot[i].number_pair > 1) {
        if (
          schedule_bot[i + 1].pair_type === 3 &&
          schedule_bot[i].pair_type === 3
        ) {
          if (
            array.find(
              (sc) => sc[0] === schedule_bot[i] && sc[1] === schedule_bot[i + 1]
            )
          ) {
            continue;
          }
        }
        fitnessWindows +=
          (schedule_bot[i + 1].number_pair - schedule_bot[i].number_pair - 1) *
          penaltyWin;
      }
    }
  }
  return fitnessWindows;
}

function fitnessSameSchedules(recommended_schedules, penaltySameRecSchedules) {
  let fitnessSameRecSc = 0;
  for (let rs of recommended_schedules) {
    let pair = rs.class.schedules.find(
      (sc) => sc.number_pair === rs.number_pair && sc.day_week === rs.day_week
    );
    if (!pair) fitnessSameRecSc += penaltySameRecSchedules;
  }
  return fitnessSameRecSc;
}
