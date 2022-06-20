import GetIdAudienceForClass from "./GetIdAudienceForClass.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import CheckPutClassForAudience from "./CheckPutClassForAudience.js";
import CheckPutClassForGroup from "./CheckPutClassForGroup.js";
import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js";

export default function Mutation(schedule,
  p_genes,
  max_day,
  max_pair,
  audiences,
  mapGroupAndAG,
  mapTeacherAndAG
) {
  let new_schedule = schedule.map(sc => Object.assign({}, sc));;
  schedule.map((sch) => {
    if (Math.random() < p_genes) {
      // Получить занятия для расписания
      let clas = sch.clas;
      let pair_types = GetPairTypeForClass(clas);
      //  удалить занятие у всех групп
      let ids_ag = clas.assigned_groups.map(ag => { return ag.id });
      new_schedule = new_schedule.filter(sc => {
        if (ids_ag.find(id => id === sc.id_assigned_group))
          return false;
        else
          return true;
      })
      for (let i = 0; i < pair_types.length; i++) {
        let pair_type = pair_types[i];
        let checkAud = false;
        let checkTeach = false;
        let checkGroup = false;
        let day_week = null;
        let number_pair = null;
        let id_audience = null;
        let index = 0;

        // Пока все условия не сойдутся, рандомно выбирать параметры
        while (!checkAud || !checkTeach || !checkGroup) {
          index++;
          if (index > 1000)
            break;
          // Если есть рек время, то не выбирать случайно
          if (clas.recommended_schedules[i]) {
            day_week = clas.recommended_schedules[i].day_week;
            number_pair = clas.recommended_schedules[i].number_pair;
          }
          else {
            day_week = GetRndInteger(1, max_day);
            number_pair = GetRndInteger(1, max_pair);
          }
          id_audience = GetIdAudienceForClass(clas, audiences);
          checkAud = CheckPutClassForAudience(id_audience, new_schedule, day_week, number_pair, pair_type);
          checkTeach = CheckPutClassForTeacher(clas, new_schedule, day_week, number_pair, pair_type, mapTeacherAndAG);
          checkGroup = CheckPutClassForGroup(clas, new_schedule, day_week, number_pair, pair_type, mapGroupAndAG);
        }
        // вставить в расписание для всех групп
        clas.assigned_groups.map(ag => {
          new_schedule.unshift({
            number_pair,
            day_week,
            pair_type,
            id_assigned_group: ag.id,
            id_audience,
            clas,
          });
        })

      }
    }
  });
  return new_schedule;
}
