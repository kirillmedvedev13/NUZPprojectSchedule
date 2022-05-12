import GetIdAudienceForClassLecture from "./GetIdAudienceForClassLecture.js";
import GetIdAudienceForClassPractice from "./GetIdAudienceForClassPractice.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import CheckPutClassForGroupLecture from "./CheckPutClassForGroupLecture.js";
import CheckPutClassForGroupPractice from "./CheckPutClassForGroupPractice.js";
import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js";
import CheckPutClassForAudience from "./CheckPutClassForAudience.js";
export default function (
  classes,
  population_size,
  max_day,
  max_pair,
  audiences,
  mapGroupAndAG,
  mapTeacherAndAG
) {
  let populations = new Array(population_size);
  for (let i = 0; i < population_size; i++) {
    let schedule = [];
    classes.forEach((clas) => {
      // Случайная вставка в расписание - где возвращается массив, каждая ячейка которого парность в расписании
      const info = GetPairTypeForClass(clas);
      // Сколько раз вставлять данное занятие в разное время
      for (let j = 0; j < info.length; j++) {
        let isPut = false;
        while (!isPut) {
          // Если лекция то для всех групп в одно и тоже время
          if (clas.id_type_class === 1) {
            const day_week = GetRndInteger(1, max_day);
            const number_pair = GetRndInteger(1, max_pair);
            const id_audience = GetIdAudienceForClassLecture(clas, audiences);
            //Если в это время нету пары для всех групп
            if (
              CheckPutClassForGroupLecture(
                clas,
                schedule,
                day_week,
                number_pair,
                info[j],
                mapGroupAndAG
              ) &&
              CheckPutClassForTeacher(
                clas,
                schedule,
                day_week,
                number_pair,
                info[j],
                mapTeacherAndAG
              ) &&
              CheckPutClassForAudience(
                id_audience,
                schedule,
                day_week,
                number_pair,
                info[j]
              )
            ) {
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
              isPut = true;
            }
          }
          // Если практика то для каждой группы своё время
          else if (clas.id_type_class === 2) {
            clas.assigned_groups.map((ag) => {
              let isPutPractice = false;
              while (!isPutPractice) {
                const day_week = GetRndInteger(1, max_day);
                const number_pair = GetRndInteger(1, max_pair);
                const id_audience = GetIdAudienceForClassPractice(
                  ag.group.capacity,
                  clas,
                  audiences
                );
                // Если в это время нету пары для конкретной группы
                if (
                  CheckPutClassForGroupPractice(
                    ag.id_group,
                    schedule,
                    day_week,
                    number_pair,
                    info[j],
                    mapGroupAndAG
                  ) &&
                  CheckPutClassForTeacher(
                    clas,
                    schedule,
                    day_week,
                    number_pair,
                    info[j],
                    mapTeacherAndAG
                  ) &&
                  CheckPutClassForAudience(
                    id_audience,
                    schedule,
                    day_week,
                    number_pair,
                    info[j]
                  )
                ) {
                  schedule.push({
                    number_pair,
                    day_week: day_week,
                    pair_type: info[j],
                    id_audience,
                    id_assigned_group: ag.id,
                    clas,
                  });
                  isPutPractice = true;
                }
              }
              isPut = true;
            });
          }
        }
      }
    });
    populations[i] = { schedule, fitnessValue: null };
  }
  return populations;
}
