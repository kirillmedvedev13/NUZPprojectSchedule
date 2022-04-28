export default function fitness(individ, groups, classes, teachers) {
  let fitnessValue = 0;
  fitnessValue += fitnessByGroups(individ, groups, classes);
  fitnessByTeachers(individ, teachers, classes);
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
  });
  return fitnessValue;
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
    console.log("hello");
  });
}