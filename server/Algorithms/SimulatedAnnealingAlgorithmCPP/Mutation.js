import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetRndInteger from "../Service/GetRndInteger.js";

function RemoveClassToSchedule(temp, id_schedule) {
  temp = temp.filter((sc) => sc.id !== id_schedule);
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
  let currId_audience = mutation_sched.id_audience;
  let temp = schedule.scheduleForAudiences.get(currId_audience);
  if (!temp) {
    temp = [];
  }
  temp = RemoveClassToSchedule(temp, mutation_sched.id);
  schedule.scheduleForAudiences.set(currId_audience, temp);
  // Получение нового данных для занятия
  let day_week = null,
    number_pair = null;
  if (clas.recommended_schedules.length) {
    let r = GetRndInteger(0, clas.recommended_schedules.length - 1);
    day_week = clas.recommended_schedules[r].day_week;
    number_pair = clas.recommended_schedules[r].number_pair;
  } else {
    day_week = GetRndInteger(1, max_day);
    number_pair = GetRndInteger(1, max_pair);
  }
  let ids_audience = GetIdsAudienceForClass(mutation_sched.clas, audiences);
  let id_audience = ids_audience[GetRndInteger(0, ids_audience.length - 1)];
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
    let temp1 = schedule.scheduleForGroups.get(ag.id_group);
    temp1 = RemoveClassToSchedule(temp1, mutation_sched.id);
    temp1.push(mutation_sched);
    schedule.scheduleForGroups.set(ag.id_group, temp1);
  }
  // Удаление старого занятия для учителей и вставка нового
  for (const at of clas.assigned_teachers) {
    let temp2 = schedule.scheduleForTeachers.get(at.id_teacher);
    temp2 = RemoveClassToSchedule(temp2, mutation_sched.id);
    temp2.push(mutation_sched);
    schedule.scheduleForTeachers.set(at.id_teacher, temp2);
  }
  // Получение новой аудитории для занятия

  // Вставка занятия для аудитории
  let temp3 = schedule.scheduleForAudiences.get(id_audience);
  if (!temp3) {
    temp3 = [];
  }
  temp3.push(mutation_sched);
  schedule.scheduleForAudiences.set(id_audience, temp3);
  return schedule;
}
