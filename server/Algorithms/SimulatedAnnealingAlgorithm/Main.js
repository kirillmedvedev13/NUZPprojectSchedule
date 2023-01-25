import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";
import MessageType from "../../Schema/TypeDefs/MessageType.js";
import { GraphQLInt } from "graphql";
import db from "../../database.js";
import Init from "./Init.js";
import cloneDeep from "lodash.clonedeep";
import GetRndInteger from "../Service/GetRndInteger.js";
import Mutation from "./Mutation.js";
import Fitness from "../Service/Fitness.js";

export const RUN_SIMULATED_ANNEALING = async (id_cathedra, name_algorithm) => {
  let {
    max_day,
    max_pair,
    classes,
    recommended_schedules,
    audiences,
    general_values,
    params,
  } = await GetDataFromDB(id_cathedra, name_algorithm);
  let temperature, alpha;
  params.forEach((obj) => {
    if (obj.name === "temperature") temperature = +obj.value;
    else alpha = +obj.value;
  });
  let results = [];
  // Получения расписания для груп учителей если они есть  в других кафедрах
  let db_schedule = await ParseScheduleFromDB(id_cathedra);
  let currentSchedule = Init(
    classes,
    max_day,
    max_pair,
    audiences,
    db_schedule
  );
  let i = 0;
  let currentFitness = Fitness(
    currentSchedule,
    recommended_schedules,
    max_day,
    general_values
  );
  let start_time = new Date().getTime();
  while (currentFitness.fitnessValue > 0) {
    let newSchedule = cloneDeep(currentSchedule);
    let chooseSchedule = false;
    let mutation_sched = null;
    while (!chooseSchedule) {
      // Случайное занятие у учителя группы или аудитории
      let r = GetRndInteger(1, 3);
      let sc =
        r === 1
          ? newSchedule.scheduleForGroups
          : r === 2
          ? newSchedule.scheduleForTeachers
          : newSchedule.scheduleForAudiences;
      sc = Array.from(sc.values());
      // Выбор случайной сущности
      if (sc.length) {
        r = GetRndInteger(0, sc.length - 1);
        sc = sc[r];
        // Проверка есть ли занятия для сущности, если да то выбрать его для мутации
        if (sc.length) {
          r = GetRndInteger(0, sc.length - 1);
          chooseSchedule = true;
          mutation_sched = cloneDeep(sc[r]);
        }
      }
    }
    newSchedule = Mutation(
      newSchedule,
      max_day,
      max_pair,
      audiences,
      mutation_sched
    );
    let newFitness = Fitness(
      newSchedule,
      recommended_schedules,
      max_day,
      general_values
    );
    let difference = newFitness.fitnessValue - currentFitness.fitnessValue;
    if (difference < 0) {
      currentSchedule = newSchedule;
      currentFitness = newFitness;
    } else {
      let r = Math.random();
      if (r < Math.exp(-1 * (difference / temperature))) {
        currentSchedule = newSchedule;
        currentFitness = newFitness;
      }
    }
    temperature = alpha * temperature;
    if (i % 100 === 0) {
      console.log(
        `iteration: ${i} | temp: ${temperature} | fitness: ${currentFitness.fitnessValue}`
      );
      results.push([
        new Date().getTime() - start_time,
        currentFitness.fitnessValue,
      ]);
    }
    i += 1;
  }
  console.log(
    `iteration: ${i} | temp: ${temperature} | fitness: ${currentFitness.fitnessValue}`
  );
  results = JSON.stringify(results);
  await db.algorithm.update({ results }, { where: { name: name_algorithm } });
  let arrClass = new Set();
  let arrGroup = Array.from(currentSchedule.scheduleForGroups.values());
  for (const sc_group of arrGroup) {
    for (const sc of sc_group) {
      arrClass.add(
        JSON.stringify({
          day_week: sc.day_week,
          number_pair: sc.number_pair,
          pair_type: sc.pair_type,
          id_class: sc.clas.id,
          id_audience: sc.id_audience,
        })
      );
    }
  }
  let arr = [];
  arrClass.forEach((sched) => arr.push(JSON.parse(sched)));
  let isBulk = await db.schedule.bulkCreate(arr);
  if (isBulk)
    return {
      successful: true,
      message: `Success`,
    };
  else return { successful: false, message: `Some error` };
};
