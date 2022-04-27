export default function fitnessByGroups(
  individ,
  groups,
  classes,
  max_day,
  max_pair
) {
  groups.forEach((group) => {
    let fitnessValue = 0;
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
    let index = 0;
    for (let i = 0; i < max_day; i++) {
      for (let j = 0; j < max_pair; j++) {
        if (
          detectedSchedules[index].id_day_week == i &&
          detectedSchedules[index].number_pair == j
        ) {
          if (index != 0) {
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
          }
          if (
            detectedSchedules[index].id_day_week ==
              detectedSchedules[index + 1].id_day_week &&
            detectedSchedules[index].number_pair ==
              detectedSchedules[index + 1].number_pair
          ) {
            index++;
          }
          index++;
        }
      }
    }
    console.log(fitnessValue);
  });
}
