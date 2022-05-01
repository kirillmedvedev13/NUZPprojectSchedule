import GetRndInteger from "./GetRndInteger.js"
import CheckPutClassForAudience from "./CheckPutClassForAudience.js"
import CheckPutClassForGroupLecture from "./CheckPutClassForGroupLecture.js"
import CheckPutClassForGroupPractice from "./CheckPutClassForGroupPractice.js"
import CheckPutClassForTeacher from "./CheckPutClassForTeacher.js"

export default function Crossing(schedule1, schedule2, classes, mapGroupAndAG, mapTeacherAndAG) {
  let s = GetRndInteger(0, classes.length - 1);
  for (let i = s; i < classes.length; i++) {
    let type_class = classes[i].id_type_class;
    let temp1 = [];
    let temp2 = [];
    let new_schedule1 = [];
    let new_schedule2 = [];
    // Если лекция, то меняется для всех групп
    if (type_class === 1) {
      let ids_ag = classes[i].assigned_groups.map(ag => {
        return ag.id;
      })
      changeSchedule(ids_ag, temp1, temp2, schedule1, schedule2, new_schedule1, new_schedule2);
      let canPut1 = checkPutLecture(classes[i], temp1, new_schedule2, mapGroupAndAG, mapTeacherAndAG);
      let canPut2 = checkPutLecture(classes[i], temp2, new_schedule1, mapGroupAndAG, mapTeacherAndAG);
      if (canPut1 && canPut2) {
        schedule1 = removeSchedule(ids_ag, schedule1);
        schedule2 = removeSchedule(ids_ag, schedule2);
        schedule1.push(...temp2);
        schedule2.push(...temp1);
      }
    }
    //Если практика, то для каждой группы отдельно
    else if (type_class === 2) {
      classes[i].assigned_groups.forEach(ag => {
        let ids_ag = [ag.id];
        temp1 = [];
        temp2 = [];
        changeSchedule(ids_ag, temp1, temp2, schedule1, schedule2, new_schedule1, new_schedule2);
        let canPut1 = checkPutPractice(classes[i], ag.id_group, temp1, new_schedule2, mapGroupAndAG, mapTeacherAndAG);
        let canPut2 = checkPutPractice(classes[i], ag.id_group, temp2, new_schedule1, mapGroupAndAG, mapTeacherAndAG);
        if (canPut1 && canPut2) {
          schedule1 = removeSchedule(ids_ag, schedule1);
          schedule2 = removeSchedule(ids_ag, schedule2);
          schedule1.push(...temp2);
          schedule2.push(...temp1);
        }
      })
    }

  }
}

function changeSchedule(ids_ag, temp1, temp2, schedule1, schedule2, new_schedule1, new_schedule2) {
  new_schedule1 = schedule1.map(sc1 => {
    if (ids_ag.find(id => sc1.id_assigned_group === id)) {
      temp1.push(sc1);
    }
    else
      return new_schedule1.push(sc1);
  })
  schedule2.map(sc2 => {
    if (ids_ag.find(id => sc2.id_assigned_group === id)) {
      temp2.push(sc2);
    }
    else
      return new_schedule2.push(sc2);
  })
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

function removeSchedule(ids_ag, schedule) {
  schedule = schedule.filter(sc => {
    if (ids_ag.find(id => sc.id_assigned_group === id)) {
      return false;
    }
    return true;
  })
  return schedule;
}