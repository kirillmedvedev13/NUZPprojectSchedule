import GetIdAudienceForClass from "./GetIdAudienceForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import AddClassToSchedule from "./AddClassToSchedule.js";
export default function (
  classes,
  population_size,
  max_day,
  max_pair,
  audiences,
  base_schedule
) {
  let populations = new Array(population_size);
  for (let i = 0; i < population_size; i++) {
    let scheduleForGroups = new Map();
    let scheduleForTeachers = new Map();
    let scheduleForAudiences = new Map();
    let schedule = { scheduleForGroups, scheduleForTeachers, scheduleForAudiences, fitnessValue: null };
    classes.forEach((clas) => {
      // Случайная вставка в расписание - где возвращается массив, каждая ячейка которого парность в расписании
      const info = GetPairTypeForClass(clas);
      // Сколько раз вставлять данное занятие в разное время
      for (let j = 0; j < info.length; j++) {
        // Вставка для всех групп в одно и тоже время
        let day_week, number_pair;
        if (clas.recommended_schedules[j]) {
          day_week = clas.recommended_schedules[j].day_week;
          number_pair = clas.recommended_schedules[j].number_pair;
        }
        else {
          day_week = GetRndInteger(1, max_day);
          number_pair = GetRndInteger(1, max_pair);
        }
        const id_audience = GetIdAudienceForClass(clas, audiences);
        AddClassToSchedule(schedule, clas, day_week, number_pair, info[j], id_audience)
      }
    })
    // Если в базе есть созданное расписание
    if (base_schedule) {
      for (let [id_group, schedule_group] of base_schedule.scheduleForGroups.entries()) {
        let temp = schedule.scheduleForGroups.get(id_group);
        if (!temp)
          temp = [];
        temp.push(...schedule_group);
        schedule.scheduleForGroups.set(id_group, temp);
      }
      for (let [id_teacher, schedule_teacher] of base_schedule.scheduleForTeachers.entries()) {
        let temp = schedule.scheduleForTeachers.get(id_teacher);
        if (!temp)
          temp = [];
        temp.push(...schedule_teacher);
        schedule.scheduleForTeachers.set(id_teacher, temp);
      }
      for (let [id_audience, schedule_audience] of base_schedule.scheduleForAudiences.entries()) {
        let temp = schedule.scheduleForAudiences.get(id_audience);
        if (!temp)
          temp = [];
        temp.push(...schedule_audience);
        schedule.scheduleForAudiences.set(id_audience, temp);
      }
    }
    populations[i] = schedule;
  }
  return populations;
}
