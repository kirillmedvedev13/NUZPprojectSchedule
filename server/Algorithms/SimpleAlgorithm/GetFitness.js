import Fitness from "../Service/Fitness.js";

export default function GetFitness(
  schedule,
  max_day,
  max_pair,
  recommended_schedules,
  general_values
) {
  let scheduleForGroups = new Map();
  let scheduleForTeachers = new Map();
  let scheduleForAudiences = new Map();
  let newSchedule = {
    scheduleForGroups,
    scheduleForTeachers,
    scheduleForAudiences,
  };
  for (let [group, sched] of schedule.scheduleForGroups) {
    newSchedule.scheduleForGroups.set(
      group,
      GetArrSchedule(sched, max_day, max_pair)
    );
  }
  for (let [teach, sched] of schedule.scheduleForTeachers) {
    newSchedule.scheduleForTeachers.set(
      teach,
      GetArrSchedule(sched, max_day, max_pair, true)
    );
  }
  for (let [aud, sched] of schedule.scheduleForAudiences) {
    newSchedule.scheduleForAudiences.set(
      aud,
      GetArrSchedule(sched, max_day, max_pair, true)
    );
  }
  return Fitness(newSchedule, recommended_schedules, max_day, general_values);
}

function GetArrSchedule(sched, max_day, max_pair, isAud = false) {
  let temp = [];
  for (let i = 0; i < max_day; i++) {
    for (let j = 0; j < max_pair; j++) {
      for (let k = 1; k <= 3; k++) {
        for (let h = 0; h < sched[i][j][k].clas.length; h++) {
          temp.push({
            day_week: i + 1,
            number_pair: j + 1,
            pair_type: k,
            id_class: sched[i][j][k].clas[h].id,
            id_audience: isAud ? 0 : sched[i][j][k]?.ids_audience[h],
          });
        }
      }
    }
  }
  return temp;
}
