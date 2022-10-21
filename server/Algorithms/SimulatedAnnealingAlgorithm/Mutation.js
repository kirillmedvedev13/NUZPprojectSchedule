import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetRndInteger from "../Service/GetRndInteger.js";

function RemoveClassToSchedule(temp, id_schedule) {
  temp = temp.filter(sc => sc.id !== id_schedule);
  return temp;
}

export default function Mutation(
  schedule,
  max_day,
  max_pair,
  audiences,
  mutation_sched
) {
  let clas = mutation_sched.clas;
  let id_audience = mutation_sched.id_audience;
  let temp = schedule.scheduleForAudiences.get(id_audience);
  if (!temp) {
    temp = [];
  }
  temp = RemoveClassToSchedule(temp, mutation_sched.id);
  schedule.scheduleForAudiences.set(id_audience, temp);
  // Получение нового данных для занятия
  let day_week = null, number_pair = null;
  if (clas.recommended_schedules.length) {
    let r = GetRndInteger(0, clas.recommended_schedules.length - 1)
    day_week = clas.recommended_schedules[r].day_week;
    number_pair = clas.recommended_schedules[r].number_pair;
  } else {
    day_week = GetRndInteger(1, max_day);
    number_pair = GetRndInteger(1, max_pair);
  }
  mutation_sched.day_week = day_week;
  mutation_sched.number_pair = number_pair;
  mutation_sched.id_audience = id_audience;
  // Если занятие по числителю или знаменателю, то тип пары можем поменятся
  if (mutation_sched.pair_type === 1 || mutation_sched.pair_type === 2) {
    if (Math.random() <= 0.5) {
      mutation_sched.pair_type = 3 - mutation_sched.pair_type;
    }
  }
  // Удаление старого занятия для групп и вставка нового
  for (const ag of clas.assigned_groups) {
    let temp = schedule.scheduleForGroups.get(ag.id_group);
    temp = RemoveClassToSchedule(temp, mutation_sched.id);
    temp.push(mutation_sched);
    schedule.scheduleForGroups.set(ag.id_group, temp);
  }
  // Удаление старого занятия для учителей и вставка нового
  for (const at of clas.assigned_teachers) {
    let temp = schedule.scheduleForTeachers.get(at.id_teacher);
    temp = RemoveClassToSchedule(temp, mutation_sched.id);
    temp.push(mutation_sched);
    schedule.scheduleForTeachers.set(at.id_teacher, temp);
  }
  // Получение новой аудитории для занятия
  let ids_audience = GetIdsAudienceForClass(mutation_sched.clas, audiences);
  id_audience = ids_audience[GetRndInteger(0, ids_audience.length - 1)];
  // Вставка занятия для аудитории
  temp = schedule.scheduleForAudiences.get(id_audience);
  if (!temp) {
    temp = [];
  }
  temp.push(mutation_sched);
  schedule.scheduleForAudiences.set(id_audience, temp);
  return schedule;
}
