import AddClassToSchedule from "./AddClassToSchedule.js";
import GetIdsAudienceForClass from "../Service/GetIdsAudienceForClass.js";
import GetRndInteger from "../Service/GetRndInteger.js";
import GetPairTypeForClass from "../Service/GetPairTypeForClass.js";

export default function (classes, max_day, max_pair, audiences, base_schedule) {
  let last_id_schedule = Number.MIN_VALUE;
  let scheduleForGroups = new Map();
  let scheduleForTeachers = new Map();
  let scheduleForAudiences = new Map();
  let tabuList = new Map();
  let schedule = {
    scheduleForGroups,
    scheduleForTeachers,
    scheduleForAudiences,
  };
  // Если в базе есть созданное расписание
  if (base_schedule) {
    for (let [
      id_group,
      schedule_group,
    ] of base_schedule.schedule_group.entries()) {
      let temp = schedule.scheduleForGroups.get(id_group);
      if (!temp) temp = [];
      for (const sc of schedule_group) {
        last_id_schedule = Math.max(last_id_schedule, sc.id);
        temp.push(sc);
      }
      schedule.scheduleForGroups.set(id_group, temp);
    }
    for (let [
      id_teacher,
      schedule_teacher,
    ] of base_schedule.schedule_teacher.entries()) {
      let temp = schedule.scheduleForTeachers.get(id_teacher);
      if (!temp) temp = [];
      for (const sc of schedule_teacher) {
        last_id_schedule = Math.max(last_id_schedule, sc.id);
        temp.push(sc);
      }
      schedule.scheduleForTeachers.set(id_teacher, temp);
    }
    for (let [
      id_audience,
      schedule_audience,
    ] of base_schedule.schedule_audience.entries()) {
      let temp = schedule.scheduleForAudiences.get(id_audience);
      if (!temp) temp = [];
      for (const sc of schedule_audience) {
        last_id_schedule = Math.max(last_id_schedule, sc.id);
        temp.push(sc);
      }
      schedule.scheduleForAudiences.set(id_audience, temp);
    }
  }
  classes.forEach((clas) => {
    // Случайная вставка в расписание - где возвращается массив, каждая ячейка которого парность в расписании
    const info = GetPairTypeForClass(clas);
    // Сколько раз вставлять данное занятие в разное время
    for (let j = 0; j < info.length; j++) {
      last_id_schedule += 1;
      // Вставка для всех групп в одно и тоже время
      let day_week, number_pair;
      if (clas.recommended_schedules[j]) {
        day_week = clas.recommended_schedules[j].day_week;
        number_pair = clas.recommended_schedules[j].number_pair;
      } else {
        day_week = GetRndInteger(1, max_day);
        number_pair = GetRndInteger(1, max_pair);
      }
      const ids_audience = GetIdsAudienceForClass(clas, audiences);
      const id_audience =
        ids_audience[GetRndInteger(0, ids_audience.length - 1)];
      AddClassToSchedule(
        schedule,
        clas,
        day_week,
        number_pair,
        info[j],
        id_audience,
        last_id_schedule,
        tabuList
      );
    }
  });

  return { schedule, tabuList };
}
