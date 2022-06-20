import reviver from "./JSONReviver.js";

export default function Fitness(
  schedule,
  penaltySameTimesSc,
  penaltyGrWin,
  penaltyTeachWin
) {
  schedule = JSON.parse(schedule, reviver);
  for (let [key, value] of schedule.scheduleForGroups.entries())
    sortSchedule(value);
  sortSchedule(schedule.scheduleForTeacher.entries());
  sortSchedule(schedule.scheduleForAudiences.entries());
}

function sortSchedule(schedule) {
  schedule.sort(function (a, b) {
    if (a.day_week > b.day_week)
      return 1;
    if (a.day_week < b.day_week)
      return -1
    if (a.number_pair > b.number_pair)
      return 1;
    if (a.number_pair < b.number_pair)
      return -1;
    if (a.pair_type > b.pair_type)
      return 1;
    if (a.pair_type < b.pair_type)
      return -1
    return 0;
  })
}
