import GetIdAudienceForClass from "./GetIdAudienceForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import CheckPutClassLectureForGroup from "./CheckPutClassLectureForGroup.js";
import CheckPutClassPracticeForGroup from "./CheckPutClassPracticeForGroup.js";
import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js";
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
      // Случайная вставка в расписание
      const info = GetPairTypeForClass(clas);
      // Сколько раз вставлять данное занятие в разное время
      for (let j = 0; j < info.length; j++) {
        let isPut = false;
        while (!isPut) {
          const id_audience = GetIdAudienceForClass(clas, audiences);
          // Если лекция то для всех групп в одно и тоже время
          if (clas.id_type_class === 1) {
            const day_week = GetRndInteger(1, max_day);
            const number_pair = GetRndInteger(1, max_pair);
            //Если в это время нету пары для всех групп
            if (
              CheckPutClassLectureForGroup(
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
              )
            ) {
              clas.assigned_groups.map((ag) => {
                schedule.push({
                  number_pair,
                  day_week: day_week,
                  pair_type: info[j],
                  id_audience,
                  id_assigned_group: ag.id,
                });
              });
              isPut = true;
            }
          }
          // Если практика то для каждой группы своё время
          else if (clas.id_type_class === 2) {
            clas.assigned_groups.map((ag) => {
              let isPutZnam = false;
              while (!isPutZnam) {
                const day_week = GetRndInteger(1, max_day);
                const number_pair = GetRndInteger(1, max_pair);
                // Если в это время нету пары для конкретной группы
                if (
                  CheckPutClassPracticeForGroup(
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
                  )
                ) {
                  schedule.push({
                    number_pair,
                    day_week: day_week,
                    pair_type: info[j],
                    id_audience,
                    id_assigned_group: ag.id,
                  });
                  isPutZnam = true;
                }
              }
              isPut = true;
            });
          }
        }
      }
    });
    populations[i] = schedule;
  }
  return populations;
}
