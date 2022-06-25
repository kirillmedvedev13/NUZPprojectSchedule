export default function SplitPairs(schedule) {
  debugger;
  let splitSchedule = [];

  let i = 0;
  while (i < schedule.length) {
    let tempClas = JSON.parse(JSON.stringify(schedule[i]));
    let classes = schedule.filter(
      (cl) =>
        +cl.day_week === +tempClas.day_week &&
        +cl.number_pair === +tempClas.number_pair &&
        +cl.pair_type === +tempClas.pair_type &&
        +cl.assigned_group.class.id === +tempClas.assigned_group.class.id
    );
    for (let j = 0; j < classes.length; j++) {
      if (j === 0) continue;
      tempClas.assigned_group.group.name +=
        " " + classes[j].assigned_group.group.name;
    }
    splitSchedule.push(tempClas);
    i += classes.length;
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
