import GetDataFromDB from "../Service/GetDataFromDB.js";
import ParseScheduleFromDB from "../Service/ParseScheduleFromDB.js";
import MessageType from "../../Schema/TypeDefs/MessageType.js";
import { GraphQLInt } from "graphql";
import db from "../../database.js";
import Init from "./Init.js";
import cloneDeep from "clone-deep";
import GetRndInteger from "../Service/GetRndInteger.js";
import Mutation from "./Mutation.js";
import Fitness from "../Service/Fitness2.js";

export const RUN_SIMULATED_ANNEALING = {
  type: MessageType,
  args: {
    id_cathedra: { type: GraphQLInt },
  },
  async resolve(parent, { id_cathedra }) {
    let {
      max_day,
      max_pair,
      classes,
      recommended_schedules,
      audiences,
      simulated_annealing,
      general_values,
    } = await GetDataFromDB(id_cathedra);
    let { temperature, alpha } = simulated_annealing;
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
    while (currentFitness.fitnessValue > 0) {
      let newSchedule = cloneDeep(currentSchedule);
      let chooseSchedule = false;
      let mutation_sched = null;
      if (i > 10000) console.log();
      let sum = 0;
      let arr = Array.from(currentSchedule.scheduleForAudiences.values());
      for (let j = 0; j < arr.length; j++) {
        sum += arr[j].length;
      }
      console.log(`sum = ${sum}`);
      console.log(
        `iteration: ${i} | temp: ${temperature} | fitness: ${currentFitness.fitnessValue}`
      );
      console.time("it");
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
      i += 1;
      console.timeEnd("it");
    }
  },
};
