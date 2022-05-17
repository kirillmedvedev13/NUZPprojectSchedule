export default function Fitness(
  schedule,
  mapTeacherAndAG,
  mapGroupAndAG,
  penaltyGrWin,
  penaltyLateSc,
  penaltyEqSc,
  penaltySameTimesSc,
  penaltyTeachWin) {
  if (!schedule.length) {
    return 0;
  }
  let fitnessValue = 0;
  fitnessValue += fitnessByGroups(
    schedule,
    mapGroupAndAG,
    penaltyGrWin,
    penaltyLateSc,
    penaltyEqSc,
    penaltySameTimesSc
  );
  fitnessValue += fitnessByTeachers(
    schedule,
    mapTeacherAndAG,
    penaltyTeachWin,
    penaltyLateSc,
    penaltyEqSc,
    penaltySameTimesSc
  );
  return fitnessValue;
}

function fitnessByGroups(
  schedule,
  mapGroupAndAG,
  penaltyGrWin,
  penaltyLateSc,
  penaltyEqSc,
  penaltySameTimesSc
) {
  let fitnessValue = 0;
  //отбираю для каждой группы их расписание
  mapGroupAndAG.forEach((detectedAG) => {
    let detectedSchedules = schedule.filter((schedule) => {
      if (detectedAG.indexOf(schedule.id_assigned_group) != -1) {
        return schedule;
      }
    });
    //сортирую по дням
    detectedSchedules = sortDS(detectedSchedules);
    fitnessValue +=
      penaltyGrWin === 0
        ? 0
        : fitnessDSWindows(detectedSchedules, penaltyGrWin);
    fitnessValue +=
      penaltyLateSc === 0
        ? 0
        : detectedSchedules.length == 1
          ? detectedSchedules[0].number_pair * penaltyLateSc
          : fitnessDSLateSchedule(detectedSchedules, penaltyLateSc);
    fitnessValue +=
      penaltyEqSc === 0
        ? 0
        : fitnessEquelSchedule(detectedSchedules, penaltyEqSc);
    fitnessValue +=
      penaltySameTimesSc === 0
        ? 0
        : fitnessSameTimesGroup(detectedSchedules, penaltySameTimesSc);
  });

  return fitnessValue;
}

function fitnessByTeachers(
  schedule,
  mapTeacherAndAG,
  penaltyTeachWin,
  penaltyLateSc,
  penaltyEqSc,
  penaltySameTimesSc
) {
  let fitnessValue = 0;
  mapTeacherAndAG.forEach((detectedAG) => {
    let detectedSchedules = schedule.filter((schedule) => {
      if (detectedAG.indexOf(schedule.id_assigned_group) != -1) {
        return schedule;
      }
    });
    detectedSchedules = sortDS(detectedSchedules);
    fitnessValue +=
      penaltyTeachWin === 0
        ? 0
        : fitnessDSWindows(detectedSchedules, penaltyTeachWin);
    fitnessValue +=
      penaltyLateSc === 0
        ? 0
        : detectedSchedules.length == 1
          ? detectedSchedules[0].number_pair * penaltyLateSc
          : fitnessDSLateSchedule(detectedSchedules, penaltyLateSc);
    fitnessValue +=
      penaltyEqSc === 0
        ? 0
        : fitnessEquelSchedule(detectedSchedules, penaltyEqSc);
    fitnessValue +=
      penaltySameTimesSc === 0
        ? 0
        : fitnessSameTimesTeacher(detectedSchedules, penaltySameTimesSc);
  });

  return fitnessValue;
}

//сортировка по дням
function sortDS(detectedSchedules) {
  detectedSchedules.sort(function (schedule1, schedule2) {
    if (schedule1.day_week > schedule2.day_week) return 1;
    else if (schedule1.day_week == schedule2.day_week) {
      if (schedule1.number_pair > schedule2.number_pair) return 1;
      else if (schedule1.number_pair == schedule2.number_pair) {
        if (schedule1.pair_type > schedule2.pair_type) return 1;
        else if (schedule1.pair_type == schedule2.pair_type) {
          return 0;
        } else return -1;
      } else return -1;
    } else return -1;
  });
  return detectedSchedules;
}

function fitnessDSWindows(detectedSchedules, penaltyGrWin) {
  let fitnessValue = 0;
  let i = 0;
  let len = detectedSchedules.length;
  while (i < len - 2) {
    if (detectedSchedules[i].day_week == detectedSchedules[i + 1].day_week) {
      if (
        detectedSchedules[i].number_pair != detectedSchedules[i + 1].number_pair
      ) {
        if (detectedSchedules[i].pair_type == 3) {
          if (
            detectedSchedules[i + 1].pair_type != detectedSchedules[i].pair_type
          ) {
            fitnessValue +=
              (detectedSchedules[i + 1].number_pair -
                detectedSchedules[i].number_pair -
                1) *
              penaltyGrWin;
            if (
              detectedSchedules[i].day_week ==
              detectedSchedules[i + 2].day_week &&
              detectedSchedules[i + 1].pair_type !=
              detectedSchedules[i + 2].pair_type
            ) {
              fitnessValue +=
                (detectedSchedules[i + 2].number_pair -
                  detectedSchedules[i].number_pair -
                  1) *
                penaltyGrWin;
            }
          } else {
            fitnessValue +=
              (detectedSchedules[i + 1].number_pair -
                detectedSchedules[i].number_pair -
                1) *
              penaltyGrWin;
          }
        } else {
          if (
            detectedSchedules[i + 1].pair_type !=
            detectedSchedules[i].pair_type &&
            detectedSchedules[i + 1].pair_type != 3
          ) {
            if (
              detectedSchedules[i].day_week ==
              detectedSchedules[i + 2].day_week &&
              detectedSchedules[i + 1].pair_type !=
              detectedSchedules[i + 2].pair_type
            ) {
              fitnessValue +=
                (detectedSchedules[i + 2].number_pair -
                  detectedSchedules[i].number_pair -
                  1) *
                penaltyGrWin;
            }
          } else {
            fitnessValue +=
              (detectedSchedules[i + 1].number_pair -
                detectedSchedules[i].number_pair -
                1) *
              penaltyGrWin;
          }
        }
      }
    }
    i++;
  }
  if (len > 2)
    if (
      detectedSchedules[len - 3].day_week !=
      detectedSchedules[len - 2].day_week &&
      detectedSchedules[len - 2].day_week == detectedSchedules[len - 1].day_week
    ) {
      fitnessValue +=
        (detectedSchedules[len - 1].number_pair -
          detectedSchedules[len - 2].number_pair -
          1) *
        penaltyGrWin;
    }
  return fitnessValue;
}

function fitnessDSLateSchedule(detectedSchedules, penaltyLateSc) {
  let fitnessValue = 0;
  let index = 1;
  //перебираю пары
  while (index < detectedSchedules.length) {
    //добавляю номера первых пар по дням
    fitnessValue += detectedSchedules[index - 1].number_pair * penaltyLateSc;
    //остальные пропускаю
    while (
      detectedSchedules[index - 1].day_week == detectedSchedules[index].day_week
    ) {
      index++;
      if (index == detectedSchedules.length) break;
    }
    index++;
    if (index == detectedSchedules.length) break;
  }
  if (
    detectedSchedules[detectedSchedules.length - 1].day_week !=
    detectedSchedules[detectedSchedules.length - 2].day_week
  )
    fitnessValue +=
      detectedSchedules[detectedSchedules.length - 1].number_pair *
      penaltyLateSc;
  return fitnessValue;
}
function fitnessEquelSchedule(detectedSchedules, penaltyEqSc) {
  let max = -1;
  let min = max;
  let temp = 1;
  let index = 1;
  while (index < detectedSchedules.length) {
    if (
      detectedSchedules[index - 1].day_week == detectedSchedules[index].day_week
    ) {
      if (
        detectedSchedules[index - 1].number_pair !=
        detectedSchedules[index].number_pair
      )
        temp++;
    } else {
      if (max == -1) {
        max = temp;
        min = max;
      } else {
        if (temp > max) max = temp;
        if (temp < min) min = temp;
      }
      temp = 1;
    }
    index++;
  }
  return (max - min) * penaltyEqSc;
}

//пары на одно и тоже время
function fitnessSameTimesGroup(detectedSchedules, penaltySameTimesSc) {
  let fitnessValue = 0;
  let index = 1;
  while (index < detectedSchedules.length) {
    //в границе одного дня
    if (
      detectedSchedules[index - 1].day_week == detectedSchedules[index].day_week
    ) {
      //если у двух пар совпадает номер пары
      if (
        detectedSchedules[index - 1].number_pair ==
        detectedSchedules[index].number_pair
      ) {
        //все случае кроме если стоит числитель и знаменатель
        if (
          detectedSchedules[index - 1].pair_type ==
          detectedSchedules[index].pair_type ||
          detectedSchedules[index - 1].pair_type == 3 ||
          detectedSchedules[index].pair_type == 3
        )
          fitnessValue += penaltySameTimesSc;
      }
    }
    index++;
  }
  return fitnessValue;
}
function fitnessSameTimesTeacher(detectedSchedules, penaltySameTimesSc) {
  let fitnessValue = 0;
  let index = 1;
  while (index < detectedSchedules.length) {
    if (
      detectedSchedules[index - 1].day_week == detectedSchedules[index].day_week
    ) {
      if (
        detectedSchedules[index - 1].number_pair ==
        detectedSchedules[index].number_pair
      ) {
        if (
          detectedSchedules[index - 1].pair_type ===
          detectedSchedules[index].pair_type ||
          detectedSchedules[index - 1].pair_type === 3 ||
          detectedSchedules[index].pair_type === 3
        )
          if (
            detectedSchedules[index - 1].assigned_group.class.id !==
            detectedSchedules[index].assigned_group.class.id
          )
            //у учителя может стоят лекция у нескольких групп
            fitnessValue += penaltySameTimesSc;
      }
    }
    index++;
  }
  return fitnessValue;
}
