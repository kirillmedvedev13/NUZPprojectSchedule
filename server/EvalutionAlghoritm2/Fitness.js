export default function fitness(individ_schedule, mapGroupAndAG, mapTeacherAndAG) {
  let fitnessValue = 0;
  fitnessValue += fitnessByGroups(individ_schedule, mapGroupAndAG);
  fitnessValue += fitnessByTeachers(individ_schedule, mapTeacherAndAG);
  return fitnessValue;
}

function fitnessByGroups(individ_schedule, mapGroupAndAG) {
  let fitnessValue = 0;
  mapGroupAndAG.forEach((detectedAG) => {
    let detectedSchedules = individ_schedule.filter((schedule) => {
      if (detectedAG.indexOf(schedule.id_assigned_group) != -1) {
        return schedule;
      }
    });
    detectedSchedules = sortDS(detectedSchedules);
    fitnessValue += fitnessDSWindows(detectedSchedules);
    fitnessValue +=
      detectedSchedules.length == 1
        ? detectedSchedules[0].number_pair
        : fitnessDSLateSchedule(detectedSchedules);
    fitnessValue += fitnessEquelSchedule(detectedSchedules);
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
        } else return -1;
      } else return -1;
    } else return -1;
  });
  return detectedSchedules;
}
function fitnessDSWindows(detectedSchedules) {
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
        detectedSchedules[index].pair_type == 3
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
              detectedSchedules[index].number_pair -
              detectedSchedules[index - 2].number_pair -
              1;
          }
        }
        fitnessValue +=
          detectedSchedules[index].number_pair -
          detectedSchedules[index - 1].number_pair -
          1;
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

function fitnessDSLateSchedule(detectedSchedules) {
  let fitnessValue = 0;
  let index = 1;
  while (index < detectedSchedules.length) {
    fitnessValue += detectedSchedules[index - 1].number_pair;
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
    fitnessValue += detectedSchedules[detectedSchedules.length - 1].number_pair;
  return fitnessValue;
}
function fitnessEquelSchedule(detectedSchedules) {
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
  return max - min;
}

function fitnessByTeachers(individ_schedule, mapTeacherAndAG) {
  let fitnessValue = 0;
  mapTeacherAndAG.forEach((detectedAG) => {
    let detectedSchedules = individ_schedule.filter((schedule) => {
      if (detectedAG.indexOf(schedule.id_assigned_group) != -1) {
        return schedule;
      }
    });
    detectedSchedules = sortDS(detectedSchedules);
    fitnessValue += fitnessDSWindows(detectedSchedules);
    fitnessValue +=
      detectedSchedules.length == 1
        ? detectedSchedules[0].number_pair
        : fitnessDSLateSchedule(detectedSchedules);
    fitnessValue += fitnessEquelSchedule(detectedSchedules);
  });

  return fitnessValue;
}
