import GetIdAudienceForClassLecture from "./GetIdAudienceForClassLecture.js";
import GetIdAudienceForClassPractice from "./GetIdAudienceForClassPractice.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import GetRndInteger from "./GetRndInteger.js";

export default function Mutation(
  individ_schedule,
  p_genes,
  max_day,
  max_pair,
  classes,
  audiences
) {
  individ_schedule.map((sch) => {
    if (Math.random() < p_genes) {
      // Получить занятия для расписания
      let clas = null;
      let group = null;
      let id_ag = null;
      for (let cl of classes) {
        cl.assigned_groups.map((ag) => {
          if (ag.id === sch.id_assigned_group) {
            clas = cl;
            group = ag.group;
            id_ag = ag.id;
          }
        });
        if (clas) break;
      }
      let pair_types = GetPairTypeForClass(clas);
      let ids_ag = clas.assigned_groups.map(ag => { return ag.id });
      // Если лекция, то удалить эти лекции у всех групп
      if (clas.id_type_class === 1) {
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
          if (sc.id_assigned_group === id_ag)
            return false;
          else
            return true;
        })
      }
      for (let i = 0; i < pair_types.length; i++) {
        let pair_type = pair_types[i];
        let day_week = GetRndInteger(0, max_day);
        let number_pair = GetRndInteger(0, max_pair);
        let id_audience = pair_type == 1
          ? GetIdAudienceForClassLecture(clas, audiences)
          : GetIdAudienceForClassPractice(group, clas, audiences);
        // Если лекция то вставить в расписание для всех групп
        if (clas.id_type_class === 1) {
          ids_ag.map(id => {
            individ_schedule.unshift({
              number_pair,
              day_week,
              pair_type,
              id_assigned_group: id,
              id_audience,
            });
          })
        }
        // Если практика то вставить в расисание только для 1 группы
        else if (clas.id_type_class === 2) {
          individ_schedule.unshift({
            number_pair,
            day_week,
            pair_type,
            id_assigned_group: id_ag,
            id_audience,
          });
        }
      }
    }
  });
  return individ_schedule;
}
