export default function fitness(schedule, workerData) {
  if (!schedule.length) {
    return 0;
  }
  const {
    mapTeacherAndAG,
    mapGroupAndAG,
    penaltyGrWin,
    penaltyLateSc,
    penaltyEqSc,
    penaltySameTimesSc,
    penaltyTeachWin,
  } = workerData;
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
  mapGroupAndAG.forEach((detectedAG) => {
    let detectedSchedules = schedule.filter((schedule) => {
      if (detectedAG.indexOf(schedule.id_assigned_group) != -1) {
        return schedule;
      }
    });
    detectedSchedules = sortDS(detectedSchedules);
    fitnessValue += fitnessDSWindows(detectedSchedules, penaltyGrWin);
    fitnessValue +=
      detectedSchedules.length == 1
        ? detectedSchedules[0].number_pair * penaltyLateSc
        : fitnessDSLateSchedule(detectedSchedules, penaltyLateSc);
    fitnessValue += fitnessEquelSchedule(detectedSchedules, penaltyEqSc);
    fitnessValue += fitnessSameTimesGroup(
      detectedSchedules,
      penaltySameTimesSc
    );
  });

  return fitnessValue;
}
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
  let index = 1;
  while (index < detectedSchedules.length) {
    if (
      detectedSchedules[index - 1].day_week ==
      detectedSchedules[index].day_week &&
      detectedSchedules[index - 1].number_pair !=
      detectedSchedules[index].number_pair
    ) {
      if (
        detectedSchedules[index - 1].pair_type ==
        detectedSchedules[index].pair_type ||
        detectedSchedules[index].pair_type == 3 ||
        detectedSchedules[index - 1].pair_type == 3
      ) {
        if (index > 1) {
          if (
            detectedSchedules[index].pair_type == 3 &&
            detectedSchedules[index - 2].number_pair ==
            detectedSchedules[index - 1].number_pair &&
            detectedSchedules[index - 2].day_week ==
            detectedSchedules[index].day_week
          ) {
            fitnessValue +=
              (detectedSchedules[index].number_pair -
                detectedSchedules[index - 2].number_pair -
                1) *
              penaltyGrWin;
          }
        }
        if (index < detectedSchedules.length - 2) {
          if (
            detectedSchedules[index].pair_type == 3 &&
            detectedSchedules[index + 2].number_pair ==
            detectedSchedules[index + 1].number_pair &&
            detectedSchedules[index + 2].day_week ==
            detectedSchedules[index].day_week &&
            detectedSchedules[index].pair_type !=
            detectedSchedules[index + 2].pair_type
          ) {
            fitnessValue +=
              (detectedSchedules[index + 2].number_pair -
                detectedSchedules[index].number_pair -
                1) *
              penaltyGrWin;
          }
        }
        fitnessValue +=
          (detectedSchedules[index].number_pair -
            detectedSchedules[index - 1].number_pair -
            1) *
          penaltyGrWin;
      }
    }
    index++;
    if (index < detectedSchedules.length)
      if (
        detectedSchedules[index].day_week ==
        detectedSchedules[index - 1].day_week &&
        detectedSchedules[index].number_pair ==
        detectedSchedules[index - 1].number_pair
      )
        index++;
  }
  return fitnessValue;
}

function fitnessDSLateSchedule(detectedSchedules, penaltyLateSc) {
  let fitnessValue = 0;
  let index = 1;
  while (index < detectedSchedules.length) {
    fitnessValue += detectedSchedules[index - 1].number_pair * penaltyLateSc;
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
    fitnessValue += fitnessDSWindows(detectedSchedules, penaltyTeachWin);
    fitnessValue +=
      detectedSchedules.length == 1
        ? detectedSchedules[0].number_pair * penaltyLateSc
        : fitnessDSLateSchedule(detectedSchedules, penaltyLateSc);
    fitnessValue += fitnessEquelSchedule(detectedSchedules, penaltyEqSc);
    fitnessValue += fitnessSameTimesTeacher(
      detectedSchedules,
      penaltySameTimesSc
    );
  });

  return fitnessValue;
}

function fitnessSameTimesGroup(detectedSchedules, penaltySameTimesSc) {
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
            detectedSchedules[index - 1].clas.id !==
            detectedSchedules[index].clas.id
          )
            fitnessValue += penaltySameTimesSc;
      }
    }
    index++;
  }
  return fitnessValue;
}
