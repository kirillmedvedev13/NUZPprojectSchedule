import GetIdAudienceForClass from "./GetIdAudienceForClass.js";
import GetPairTypeForClass from "./GetPairTypeForClass.js";
import GetRndInteger from "./GetRndInteger.js";
import CheckPutClassForAudience from "./CheckPutClassForAudience.js";
import CheckPutClassForGroup from "./CheckPutClassForGroup.js";
import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js";
import reviver from "./JSONReviver.js";
import replacer from "./JSONReplacer.js";
import AddClassToSchedule from "./AddClassToSchedule.js";

export default function Mutation(schedule,
  p_genes,
  max_day,
  max_pair,
  audiences,
  classes
) {
  schedule = JSON.parse(schedule, reviver);
  classes.forEach(clas => {
    if (Math.random() < p_genes) {
      // Получить занятия для расписания
      let pair_types = GetPairTypeForClass(clas);
      //  удалить занятие у всех расписаний
      let isFirst = false;
      let ids_audiences = new Set();
      clas.assigned_groups.forEach(ag => {
        let temp = schedule.scheduleForGroups.get(ag.id_group);
        temp = temp.filter(sch => {
          if (sch.id_class !== clas.id)
            return true
          if (!isFirst) {
            ids_audiences.add(sch.id_audience)
            return false;
          }
        });
        isFirst = true;
        schedule.scheduleForGroups.set(ag.id_group, temp);
      })
      clas.assigned_teachers.forEach(at => {
        let temp = schedule.scheduleForTeachers.get(at.id_teacher);
        temp = temp.filter(sch => sch.id_class !== clas.id);
        schedule.scheduleForTeachers.set(at.id_teacher, temp);
      })
      ids_audiences.forEach(id_audience => {
        let temp = schedule.scheduleForAudiences.get(id_audience);
        temp = temp.filter(sch => sch.id_class !== clas.id);
        schedule.scheduleForAudiences.set(id_audience, temp);
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
          checkAud = CheckPutClassForAudience(schedule.scheduleForAudiences.get(id_audience), day_week, number_pair, pair_type);
          checkTeach = CheckPutClassForTeacher(schedule.scheduleForTeachers, clas, day_week, number_pair, pair_type);
          checkGroup = CheckPutClassForGroup(schedule.scheduleForGroups, clas, day_week, number_pair, pair_type);
        }
        // вставить в расписание для всех групп
        AddClassToSchedule(schedule, clas, day_week, number_pair, pair_types[i], id_audience);
      }
    }
  })

  return JSON.stringify(schedule, replacer);
}
