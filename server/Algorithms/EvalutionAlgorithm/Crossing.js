import GetRndInteger from "../Service/GetRndInteger.js";
import replacer from "./JSONReplacer.js";
import reviver from "./JSONReviver.js";

export default function Crossing(schedule1, schedule2, classes) {
  let s = GetRndInteger(0, classes.length - 1);
  let f = GetRndInteger(s, classes.length - 1);
  let population_child1 = JSON.parse(schedule1, reviver);
  let population_child2 = JSON.parse(schedule2, reviver);
  for (let i = s; i <= f; i++) {
    let id_audiences1 = new Set();
    let id_audiences2 = new Set();
    let isFirst = false;
    // Обмен занятий для групп
    classes[i].assigned_groups.forEach((ag) => {
      let tempScheduleForGroup1 = population_child1.scheduleForGroups.get(
        ag.id_group
      );
      let temp1 = [];
      tempScheduleForGroup1 = tempScheduleForGroup1.filter((sch) => {
        if (sch.id_class !== classes[i].id) return true;
        else {
          temp1.push(sch);
          return false;
        }
      });
      let tempScheduleForGroup2 = population_child2.scheduleForGroups.get(
        ag.id_group
      );
      let temp2 = [];
      tempScheduleForGroup2 = tempScheduleForGroup2.filter((sch) => {
        if (sch.id_class !== classes[i].id) return true;
        else {
          temp2.push(sch);
          return false;
        }
      });
      tempScheduleForGroup1.push(...temp2);
      tempScheduleForGroup2.push(...temp1);
      population_child1.scheduleForGroups.set(
        ag.id_group,
        tempScheduleForGroup1
      );
      population_child2.scheduleForGroups.set(
        ag.id_group,
        tempScheduleForGroup2
      );
      // Пройтись по занятиям что бы взять аудитории
      if (!isFirst) {
        isFirst = true;
        temp1.forEach((sc) => {
          id_audiences1.add(sc.id_audience);
        });
        temp2.forEach((sc) => {
          id_audiences2.add(sc.id_audience);
        });
      }
    });
    // Обмен занятий для учителей
    classes[i].assigned_teachers.forEach((at) => {
      let tempScheduleForTeacher1 = population_child1.scheduleForTeachers.get(
        at.id_teacher
      );
      let temp1 = [];
      tempScheduleForTeacher1 = tempScheduleForTeacher1.filter((sch) => {
        if (sch.id_class !== classes[i].id) return true;
        else {
          temp1.push(sch);
          return false;
        }
      });
      let tempScheduleForTeacher2 = population_child2.scheduleForTeachers.get(
        at.id_teacher
      );
      let temp2 = [];
      tempScheduleForTeacher2 = tempScheduleForTeacher2.filter((sch) => {
        if (sch.id_class !== classes[i].id) return true;
        else {
          temp2.push(sch);
          return false;
        }
      });
      tempScheduleForTeacher1.push(...temp2);
      tempScheduleForTeacher2.push(...temp1);
      population_child1.scheduleForTeachers.set(
        at.id_teacher,
        tempScheduleForTeacher1
      );
      population_child2.scheduleForTeachers.set(
        at.id_teacher,
        tempScheduleForTeacher2
      );
    });
    // Обмен занятий для аудитории
    let temp1 = [];
    id_audiences1.forEach((id_audience) => {
      let scheduleForAudience1 =
        population_child1.scheduleForAudiences.get(id_audience);
      let temp = [];
      scheduleForAudience1 = scheduleForAudience1.filter((sch) => {
        if (sch.id_class !== classes[i].id) return true;
        else {
          temp.push(sch);
          return false;
        }
      });
      population_child1.scheduleForAudiences.set(
        id_audience,
        scheduleForAudience1
      );
      temp1.push(...temp);
    });
    let temp2 = [];
    id_audiences2.forEach((id_audience) => {
      let scheduleForAudience2 =
        population_child2.scheduleForAudiences.get(id_audience);
      let temp = [];
      scheduleForAudience2 = scheduleForAudience2.filter((sch) => {
        if (sch.id_class !== classes[i].id) return true;
        else {
          temp.push(sch);
          return false;
        }
      });
      population_child2.scheduleForAudiences.set(
        id_audience,
        scheduleForAudience2
      );
      temp2.push(...temp);
    });
    id_audiences1.forEach((id_audience) => {
      let temp = temp1.filter((sch) => sch.id_audience === id_audience);
      let temp_sch = population_child2.scheduleForAudiences.get(id_audience);
      if (!temp_sch) temp_sch = [];
      temp_sch.push(...temp);
      population_child2.scheduleForAudiences.set(id_audience, temp_sch);
    });
    id_audiences2.forEach((id_audience) => {
      let temp = temp2.filter((sch) => sch.id_audience === id_audience);
      let temp_sch = population_child1.scheduleForAudiences.get(id_audience);
      if (!temp_sch) temp_sch = [];
      temp_sch.push(...temp);
      population_child1.scheduleForAudiences.set(id_audience, temp_sch);
    });
  }
  return {
    population_child1: JSON.stringify(population_child1, replacer),
    population_child2: JSON.stringify(population_child1, replacer),
  };
}
