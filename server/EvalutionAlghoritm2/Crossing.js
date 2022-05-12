import GetRndInteger from "./GetRndInteger.js"
import CheckPutClassForAudience from "./CheckPutClassForAudience.js"
import CheckPutClassForGroupLecture from "./CheckPutClassForGroupLecture.js"
import CheckPutClassForGroupPractice from "./CheckPutClassForGroupPractice.js"
import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js"
import cloneDeep from "lodash/clonedeep.js";

export default function Crossing(schedule1, schedule2, classes, mapGroupAndAG, mapTeacherAndAG, population_child) {
  let s = GetRndInteger(0, classes.length - 1);
  let current_schedule1 = cloneDeep(schedule1);
  let current_schedule2 = cloneDeep(schedule2);

  for (let i = s; i < classes.length; i++) {
    let type_class = classes[i].id_type_class;
    // Если лекция, то меняется для всех групп
    if (type_class === 1) {
      // Закре группы для текущего занятия
      let ids_ag = classes[i].assigned_groups.map(ag => {
        return ag.id;
      })
      let { new_schedule1, new_schedule2, temp1, temp2 } = changeSchedule(ids_ag, current_schedule1, current_schedule2);
      // Проверка на то можно ли вставить выбранные предметы из 1 во 2 расписание и наоборот
      let canPut1 = checkPutLecture(classes[i], temp1, new_schedule2, mapGroupAndAG, mapTeacherAndAG);
      let canPut2 = checkPutLecture(classes[i], temp2, new_schedule1, mapGroupAndAG, mapTeacherAndAG);
      if (canPut1 && canPut2) {
        new_schedule1.push(...temp2);
        new_schedule2.push(...temp1);
        current_schedule1 = cloneDeep(new_schedule1);
        current_schedule2 = cloneDeep(new_schedule2);
      }
    }
    //Если практика, то для каждой группы отдельно
    else if (type_class === 2) {
      classes[i].assigned_groups.forEach(ag => {
        let ids_ag = [ag.id];
        let { new_schedule1, new_schedule2, temp1, temp2 } = changeSchedule(ids_ag, current_schedule1, current_schedule2);
        // Проверка на то можно ли вставить выбранные предметы из 1 во 2 расписание и наоборот
        let canPut1 = checkPutPractice(classes[i], ag.id_group, temp1, new_schedule2, mapGroupAndAG, mapTeacherAndAG);
        let canPut2 = checkPutPractice(classes[i], ag.id_group, temp2, new_schedule1, mapGroupAndAG, mapTeacherAndAG);
        if (canPut1 && canPut2) {
          new_schedule1.push(...temp2);
          new_schedule2.push(...temp1);
          current_schedule1 = cloneDeep(new_schedule1);
          current_schedule2 = cloneDeep(new_schedule2);
        }
      })
    }
  }
  population_child.push({ schedule: current_schedule1, fitnessValue: Number.MAX_VALUE });
  population_child.push({ schedule: current_schedule2, fitnessValue: Number.MAX_VALUE });
}

function changeSchedule(ids_ag, schedule1, schedule2) {
  let temp1 = [];
  let temp2 = [];
  // Копия расписания 1 без предметов из ids_ag
  let new_schedule1 = schedule1.filter(sc1 => {
    if (ids_ag.find(id => sc1.id_assigned_group === id)) {
      temp1.push(sc1);
      return false;
    }
    else
      return true;
  })
  // Копия расписания 2 без предметов из ids_ag
  let new_schedule2 = schedule2.filter(sc2 => {
    if (ids_ag.find(id => sc2.id_assigned_group === id)) {
      temp2.push(sc2);
      return false;
    }
    else
      return true;
  })
  return { new_schedule1, new_schedule2, temp1, temp2 }
}

function checkPutLecture(clas, temp, schedule, mapGroupAndAG, mapTeacherAndAG) {
  let isPutTeacher = false;
  let isPutAudience = false;
  let isPutGroup = false;
  let canPut = true;
  for (const sch of temp) {
    isPutTeacher = CheckPutClassForTeacher(clas, schedule, sch.day_week, sch.number_pair, sch.pair_type, mapTeacherAndAG);
    isPutAudience = CheckPutClassForAudience(sch.id_audience, schedule, sch.day_week, sch.number_pair, sch.pair_type);
    isPutGroup = CheckPutClassForGroupLecture(clas, schedule, sch.day_week, sch.number_pair, sch.pair_type, mapGroupAndAG);
    if (!isPutTeacher || !isPutAudience || !isPutGroup) {
      canPut = false;
      break;
    }
  }
  return canPut;
}

function checkPutPractice(clas, id_group, temp, schedule, mapGroupAndAG, mapTeacherAndAG) {
  let isPutTeacher = false;
  let isPutAudience = false;
  let isPutGroup = false;
  let canPut = true;
  for (const sch of temp) {
    isPutTeacher = CheckPutClassForTeacher(clas, schedule, sch.day_week, sch.number_pair, sch.pair_type, mapTeacherAndAG);
    isPutAudience = CheckPutClassForAudience(sch.id_audience, schedule, sch.day_week, sch.number_pair, sch.pair_type);
    isPutGroup = CheckPutClassForGroupPractice(id_group, schedule, sch.day_week, sch.number_pair, sch.pair_type, mapGroupAndAG);
    if (!isPutTeacher || !isPutAudience || !isPutGroup) {
      canPut = false;
      break;
    }
  }
  return canPut;
}
