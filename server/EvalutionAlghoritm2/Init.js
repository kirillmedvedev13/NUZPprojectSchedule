import GetIdAudienceForClass from "./GetIdAudienceForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import AddClassToSchedule from "./AddClassToSchedule.js";
export default function (
  classes,
  population_size,
  max_day,
  max_pair,
  audiences
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
    populations[i] = schedule;
  }
  return populations;
}
