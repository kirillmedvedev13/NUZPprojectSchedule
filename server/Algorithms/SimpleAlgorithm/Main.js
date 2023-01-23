import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";
import db from "../../database.js";
import AddClassToScheduleNew from "./AddClassToScheduleNew.js";
import AddClassToScheduleOld from "./AddClassToScheduleOld.js";
import GetFitness from "./GetFitness.js";

export const RUN_SA = async (id_cathedra) => {
  let {
    max_day,
    max_pair,
    classes,
    recommended_schedules,
    audiences,
    general_values,
    results,
  } = await GetDataFromDB(id_cathedra);
  let scheduleForGroups = new Map();
  let scheduleForTeachers = new Map();
  let scheduleForAudiences = new Map();
  let schedule = {
    scheduleForGroups,
    scheduleForTeachers,
    scheduleForAudiences,
  };
  // Получения расписания для груп учителей если они есть  в других кафедрах
  let newResults = [];
  let start_time = new Date().getTime();
  newResults.push([0, 0]);

  let db_schedule = await ParseScheduleFromDB(id_cathedra);
  if (db_schedule) {
    AddClassToScheduleOld(schedule, db_schedule, max_day, max_pair);
  }
  for (let clas of classes) {
    AddClassToScheduleNew(schedule, max_day, max_pair, clas, audiences);
  }
  let arrClass = new Set();
  for (let group of schedule.scheduleForGroups.values()) {
    for (let i = 0; i < max_day; i++) {
      for (let j = 0; j < max_pair; j++) {
        for (let k = 1; k <= 3; k++) {
          for (let h = 0; h < group[i][j][k].clas.length; h++) {
            // Вставка уникальных занятий
            arrClass.add(
              JSON.stringify({
                day_week: i + 1,
                number_pair: j + 1,
                pair_type: k,
                id_class: group[i][j][k].clas[h].id,
                id_audience: group[i][j][k].ids_audience[h],
              })
            );
          }
        }
      }
    }
  }
  let fitnessValue = GetFitness(
    schedule,
    max_day,
    max_pair,
    recommended_schedules,
    general_values
  );
  newResults.push([
    new Date().getTime() - start_time,
    fitnessValue.fitnessValue,
  ]);
  results.simple_algorithm = newResults;
  results = JSON.stringify(results);
  await db.algorithm.update(
    { results },
    { where: { name: "simple_algorithm" } }
  );
  let arr = [];
  arrClass.forEach((sched) => arr.push(JSON.parse(sched)));
  let isBulk = await db.schedule.bulkCreate(arr);
  if (isBulk)
    return {
      successful: true,
      message: `Total fitness: ${fitnessValue.fitnessValue}`,
    };
  else return { successful: false, message: `Some error` };
};
