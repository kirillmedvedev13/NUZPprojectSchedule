export default function SplitPairs(schedule) {
  let i = 1;
  let tempSched = [];
  let tempGroups = [];
  let flag = false;
  while (i < schedule.length) {
    if (
      schedule[i - 1].day_week === schedule[i].day_week &&
      schedule[i - 1].number_pair === schedule[i].number_pair &&
      schedule[i - 1].pair_type === schedule[i].pair_type &&
      schedule[i - 1].assigned_group.class.id ===
        schedule[i].assigned_group.class.id
    ) {
      tempGroups.push(schedule[i - 1].assigned_group.group.name);
      if (i == schedule.length - 1) {
        tempGroups.push(schedule[i].assigned_group.group.name);
        flag = true;
      }
    } else {
      tempGroups.push(schedule[i - 1].assigned_group.group.name);
      let copySched = JSON.parse(JSON.stringify(schedule[i - 1]));
      copySched.assigned_group.group.name = tempGroups.join();
      tempSched.push(copySched);
      tempGroups = [];
      if (i == schedule.length - 1 && !flag) tempSched.push(schedule[i]);
    }
    i++;
  }
  tempSched.sort(function (schedule1, schedule2) {
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
  return schedule.length == 0 ? schedule : tempSched;
}
