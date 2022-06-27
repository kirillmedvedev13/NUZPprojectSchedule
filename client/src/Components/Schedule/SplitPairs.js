export default function SplitPairs(schedule) {
  let splitSchedule = [];

  let i = 0;
  while (i < schedule.length) {
    let tempClas = JSON.parse(JSON.stringify(schedule[i]));
    tempClas.assigned_group.group.name =
      tempClas.assigned_group.group.specialty.cathedra.short_name +
      "-" +
      tempClas.assigned_group.group.name;
    let classes = schedule.filter(
      (cl) =>
        +cl.day_week === +tempClas.day_week &&
        +cl.number_pair === +tempClas.number_pair &&
        +cl.pair_type === +tempClas.pair_type &&
        +cl.assigned_group.class.id === +tempClas.assigned_group.class.id
    );
    for (let j = 1; j < classes.length; j++) {
      tempClas.assigned_group.group.name +=
        "," +
        classes[j].assigned_group.group.specialty.cathedra.short_name +
        "-" +
        classes[j].assigned_group.group.name;
    }
    splitSchedule.push(tempClas);
    i += classes.length === 0 ? 1 : classes.length;
  }
  sortSchedule(splitSchedule);
  return splitSchedule;
}

function sortSchedule(schedule) {
  schedule.sort((schedule1, schedule2) => {
    if (schedule1.number_pair > schedule2.number_pair) return 1;
    else if (schedule1.number_pair === schedule2.number_pair) {
      if (schedule1.pair_type > schedule2.pair_type) return 1;
      else if (schedule1.pair_type === schedule2.pair_type) {
        if (schedule1.day_week > schedule2.day_week) return 1;
        else if (schedule1.day_week === schedule2.day_week) {
          return 0;
        } else return -1;
      } else return -1;
    } else return -1;
  });
}
