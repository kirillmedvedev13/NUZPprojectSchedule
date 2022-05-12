import GetIdAudienceForClassLecture from "./GetIdAudienceForClassLecture.js";
import GetIdAudienceForClassPractice from "./GetIdAudienceForClassPractice.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
export default function (
  classes,
  population_size,
  max_day,
  max_pair,
  audiences
) {
  let populations = new Array(population_size);
  for (let i = 0; i < population_size; i++) {
    let schedule = [];
    classes.forEach((clas) => {
      // Случайная вставка в расписание - где возвращается массив, каждая ячейка которого парность в расписании
      const info = GetPairTypeForClass(clas);
      // Сколько раз вставлять данное занятие в разное время
      for (let j = 0; j < info.length; j++) {
        // Если лекция то для всех групп в одно и тоже время
        if (clas.id_type_class === 1) {
          const day_week = GetRndInteger(1, max_day);
          const number_pair = GetRndInteger(1, max_pair);
          const id_audience = GetIdAudienceForClassLecture(clas, audiences);
          //Если в это время нету пары для всех групп
          clas.assigned_groups.map((ag) => {
            schedule.push({
              number_pair,
              day_week: day_week,
              pair_type: info[j],
              id_audience,
              id_assigned_group: ag.id,
              clas,
            });
          });
        }
        // Если практика то для каждой группы своё время
        else if (clas.id_type_class === 2) {
          clas.assigned_groups.map((ag) => {
            const day_week = GetRndInteger(1, max_day);
            const number_pair = GetRndInteger(1, max_pair);
            const id_audience = GetIdAudienceForClassPractice(
              ag.group.capacity,
              clas,
              audiences
            );
            // Если в это время нету пары для конкретной группы
            schedule.push({
              number_pair,
              day_week: day_week,
              pair_type: info[j],
              id_audience,
              id_assigned_group: ag.id,
              clas,
            });
          });
        }
      }
    })
    populations[i] = { schedule, fitnessValue: null };
  }
  return populations;
}
