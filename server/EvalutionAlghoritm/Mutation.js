import GetIdAudienceForClassLecture from "./GetIdAudienceForClassLecture.js";
import GetIdAudienceForClassPractice from "./GetIdAudienceForClassPractice.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import GetRndInteger from "./GetRndInteger.js";

export default function Mutation(
  individ_schedule,
  p_genes,
  max_day,
  max_pair,
  audiences,
) {
  individ_schedule.map((sch) => {
    if (Math.random() < p_genes) {
      // Получить занятия для расписания
      let clas = sch.clas;
      let pair_types = GetPairTypeForClass(clas);
      // Если лекция, то удалить эти лекции у всех групп
      if (clas.id_type_class === 1) {
        let ids_ag = clas.assigned_groups.map(ag => { return ag.id });
        individ_schedule = individ_schedule.filter(sc => {
          if (ids_ag.find(id => id === sc.id_assigned_group))
            return false;
          else
            return true;
        })
      }
      // Если практика, то удалить практики только у одной группы
      else if (clas.id_type_class === 2) {
        individ_schedule = individ_schedule.filter(sc => {
          if (sc.id_assigned_group === sch.id_assigned_group)
            return false;
          else
            return true;
        })
      }
      let ag = sch.clas.assigned_groups.find(ag => ag.id === sch.id_assigned_group);
      let group = ag.group;
      for (let i = 0; i < pair_types.length; i++) {
        let pair_type = pair_types[i];

        let day_week = null;
        let number_pair = null;
        let id_audience = null;
        // Пока все условия не сойдутся, рандомно выбирать параметры
        day_week = GetRndInteger(0, max_day);
        number_pair = GetRndInteger(0, max_pair);
        id_audience = clas.id_type_class === 1
          ? GetIdAudienceForClassLecture(clas, audiences)
          : GetIdAudienceForClassPractice(group.capacity, clas, audiences);
        // Если лекция то вставить в расписание для всех групп
        if (clas.id_type_class === 1) {
          clas.assigned_groups.map(ag => {
            individ_schedule.unshift({
              number_pair,
              day_week,
              pair_type,
              id_assigned_group: ag.id,
              id_audience,
              clas,
            });
          })
        }
        // Если практика то вставить в расисание только для 1 группы
        else if (clas.id_type_class === 2) {
          individ_schedule.unshift({
            number_pair,
            day_week,
            pair_type,
            id_assigned_group: ag.id,
            id_audience,
            clas,
          });
        }
      }
    }
  });
  return individ_schedule;
}
