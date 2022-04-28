export default function fitness(individ, groups, classes, teachers) {
  let fitnessValue = 0;
  fitnessValue += fitnessByGroups(individ, groups, classes);
  fitnessValue += fitnessByTeachers(individ, teachers, classes);
  return fitnessValue;
}

function fitnessByGroups(individ, groups, classes) {
  let fitnessValue = 0;
  groups.forEach((group) => {
    let detectedAG = [];
    classes.map((clas) => {
      clas.assigned_groups.map((ag) => {
        if (ag.id_group == group.id) detectedAG.push(ag.id);
      });
    });
    let detectedSchedules = individ.filter((schedule) => {
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
  });
  return fitnessValue;
}
function sortDS(detectedSchedules) {
  detectedSchedules.sort(function (schedule1, schedule2) {
    if (schedule1.id_day_week > schedule2.id_day_week) return 1;
    else if (schedule1.id_day_week == schedule2.id_day_week) {
      if (schedule1.number_pair > schedule2.number_pair) return 1;
      else if (schedule1.number_pair == schedule2.number_pair) {
        if (schedule1.id_pair_type > schedule2.id_pair_type) return 1;
        else if (schedule1.id_pair_type == schedule2.id_pair_type) {
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
      detectedSchedules[index - 1].id_day_week ==
        detectedSchedules[index].id_day_week &&
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
            detectedSchedules[index - 2].id_day_week ==
              detectedSchedules[index].id_day_week
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
        detectedSchedules[index].id_day_week ==
          detectedSchedules[index - 1].id_day_week &&
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
      detectedSchedules[index - 1].id_day_week ==
      detectedSchedules[index].id_day_week
    ) {
      index++;
      if (index == detectedSchedules.length) break;
    }
    index++;
    if (index == detectedSchedules.length) break;
  }
  if (
    detectedSchedules[detectedSchedules.length - 1].id_day_week !=
    detectedSchedules[detectedSchedules.length - 2].id_day_week
  )
    fitnessValue += detectedSchedules[detectedSchedules.length - 1].number_pair;
  return fitnessValue;
}
function fitnessEquelSchedule(detectedSchedules) {
  let max = -1;
  let min = max;
  let temp = 0;
  let index = 1;
  while (index < detectedSchedules.length) {
    if (
      detectedSchedules[index - 1].id_day_week ==
      detectedSchedules[index].id_day_week
    ) {
      temp++;
    } else {
      if (max == -1) {
        max = temp;
        min = max;
      } else {
        if (temp > max) max = temp;
        if (temp < min) min = temp;
      }
      temp = 0;
    }
    index++;
  }
  console.log("hello");
}

function fitnessByTeachers(individ, teachers, classes) {
  let fitnessValue = 0;
  teachers.forEach((teacher) => {
    let detectedAG = [];
    classes.map((clas) => {
      clas.assigned_groups.map((ag) => {
        teacher.assigned_teachers.map((at) => {
          if (ag.id_class == at.id_class) detectedAG.push(ag.id);
        });
      });
    });
    let detectedSchedules = individ.filter((schedule) => {
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
  });
  return fitnessValue;
}
